import os
import tempfile
from fastapi import FastAPI, File, HTTPException, UploadFile
from .ocr import run_ocr
from .extract_fields import extract_fields

import cv2
import pytesseract
from pypdf import PdfReader


app = FastAPI(title="DoNotRisk OCR Service", version="1.1.0")


@app.get("/")
def root():
  return {"service": "ocr", "status": "ok"}


@app.get("/health")
def health():
  return {"status": "ok"}


@app.post("/extract")
async def extract(file: UploadFile = File(...)):
  suffix = os.path.splitext(file.filename or "")[1] or ".bin"
  with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
    temp_path = temp_file.name
    temp_file.write(await file.read())

  try:
    return run_ocr(temp_path)
  except Exception as exc:
    # Best-effort fallback: return extracted text/fields instead of failing hard.
    try:
      raw_text = ""
      if suffix.lower() == ".pdf":
        try:
          reader = PdfReader(temp_path)
          chunks = []
          for page in reader.pages:
            txt = page.extract_text() or ""
            if txt.strip():
              chunks.append(txt.strip())
          raw_text = "\n".join(chunks).strip()
        except Exception:
          raw_text = ""
      else:
        img = cv2.imread(temp_path)
        if img is not None:
          raw_text = (pytesseract.image_to_string(img, config="--oem 3 --psm 6") or "").strip()

      extracted = extract_fields(raw_text, image_quality="low", qr_codes=[], barcodes=[])
      extracted["raw_text"] = raw_text
      extracted["quality"] = extracted.get("quality") or "low"
      extracted["scan_quality"] = extracted.get("scan_quality") or "low"
      extracted["source_type"] = "pdf" if suffix.lower() == ".pdf" else "image"
      extracted["multi_ocr_retry"] = False
      extracted["fallback"] = True
      extracted["fallback_error"] = str(exc)
      return extracted
    except Exception:
      raise HTTPException(status_code=422, detail=f"OCR failed: {str(exc)}")
  finally:
    try:
      os.remove(temp_path)
    except Exception:
      pass
