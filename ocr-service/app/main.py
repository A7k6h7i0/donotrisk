import os
import tempfile
from fastapi import FastAPI, File, HTTPException, UploadFile
from .ocr import run_ocr


app = FastAPI(title="DoNotRisk OCR Service", version="1.1.0")


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
    raise HTTPException(status_code=422, detail=f"OCR failed: {str(exc)}")
  finally:
    try:
      os.remove(temp_path)
    except Exception:
      pass
