import os
from typing import Any

import cv2
import numpy as np
import pytesseract
from pypdf import PdfReader

from .extract_fields import extract_fields
from .image_preprocess import preprocess_image

try:
    from pyzbar.pyzbar import decode as zbar_decode
except Exception:
    zbar_decode = None

try:
    from paddleocr import PaddleOCR
except Exception:
    PaddleOCR = None

try:
    import easyocr
except Exception:
    easyocr = None

try:
    import pypdfium2 as pdfium
except Exception:
    pdfium = None

_paddle_engine = None
_easy_engine = None


def get_paddle_engine():
    global _paddle_engine
    if _paddle_engine is not None:
        return _paddle_engine
    if PaddleOCR is None:
        return None

    use_gpu = os.getenv("PADDLE_USE_GPU", "false").lower() == "true"
    try:
        _paddle_engine = PaddleOCR(use_angle_cls=True, lang="en", use_gpu=use_gpu, show_log=False)
    except Exception:
        _paddle_engine = None
    return _paddle_engine


def get_easy_engine():
    global _easy_engine
    if _easy_engine is not None:
        return _easy_engine
    if easyocr is None:
        return None

    use_gpu = os.getenv("EASYOCR_USE_GPU", "false").lower() == "true"
    try:
        _easy_engine = easyocr.Reader(["en"], gpu=use_gpu, verbose=False)
    except Exception:
        _easy_engine = None
    return _easy_engine


def decode_qr_and_barcodes(image: np.ndarray) -> tuple[list[str], list[str]]:
    if zbar_decode is None:
        return [], []

    qr_codes: list[str] = []
    barcodes: list[str] = []
    for item in zbar_decode(image):
        raw = item.data.decode("utf-8", errors="ignore").strip()
        if not raw:
            continue
        if item.type and item.type.upper() == "QRCODE":
            qr_codes.append(raw)
        else:
            barcodes.append(raw)

    return dedupe(qr_codes), dedupe(barcodes)


def dedupe(values: list[str]) -> list[str]:
    seen = set()
    out = []
    for value in values:
        key = value.strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        out.append(value.strip())
    return out


def paddle_ocr_text(image: np.ndarray) -> str:
    engine = get_paddle_engine()
    if engine is None:
        return ""

    try:
        result = engine.ocr(image, cls=True)
    except Exception:
        return ""

    lines = []
    for page in result or []:
        for item in page or []:
            if len(item) < 2:
                continue
            text = str(item[1][0]).strip()
            if text:
                lines.append(text)
    return "\n".join(lines).strip()


def easy_ocr_text(image: np.ndarray) -> str:
    engine = get_easy_engine()
    if engine is None:
        return ""

    try:
        result = engine.readtext(image, detail=0, paragraph=False)
    except Exception:
        return ""
    return "\n".join([str(x).strip() for x in result if str(x).strip()]).strip()


def tesseract_text(image: np.ndarray) -> str:
    tesseract_cmd = os.getenv("TESSERACT_CMD")
    if tesseract_cmd:
        pytesseract.pytesseract.tesseract_cmd = tesseract_cmd

    best = ""
    for cfg in ["--oem 3 --psm 6", "--oem 3 --psm 11", "--oem 3 --psm 4"]:
        try:
            txt = pytesseract.image_to_string(image, config=cfg) or ""
            if len(txt.strip()) > len(best.strip()):
                best = txt
        except Exception:
            continue
    return best.strip()


def pick_longest(texts: list[str]) -> str:
    cleaned = [t.strip() for t in texts if t and t.strip()]
    if not cleaned:
        return ""
    return max(cleaned, key=lambda t: len(t))


def parse_pdf_text(path: str) -> str:
    try:
        reader = PdfReader(path)
    except Exception:
        return ""

    chunks = []
    for page in reader.pages:
        txt = page.extract_text() or ""
        if txt.strip():
            chunks.append(txt.strip())
    return "\n".join(chunks).strip()


def render_pdf_pages(path: str, max_pages: int = 4) -> list[np.ndarray]:
    if pdfium is None:
        return []

    images = []
    try:
        doc = pdfium.PdfDocument(path)
        total = min(len(doc), max_pages)
        for idx in range(total):
            page = doc[idx]
            bitmap = page.render(scale=2.0)
            pil = bitmap.to_pil()
            arr = np.array(pil)
            if arr.ndim == 2:
                arr = cv2.cvtColor(arr, cv2.COLOR_GRAY2BGR)
            else:
                arr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
            images.append(arr)
            page.close()
    except Exception:
        return images

    return images


def run_ocr_on_image(image: np.ndarray) -> dict[str, Any]:
    processed = preprocess_image(image)
    variants = processed["variants"]
    image_quality = processed["quality"]

    qr_codes, barcodes = decode_qr_and_barcodes(image)

    engine_results = {"paddle": "", "easyocr": "", "tesseract": ""}

    candidate_texts = []
    for variant in variants[:5]:
        ptxt = paddle_ocr_text(variant)
        etxt = easy_ocr_text(variant)
        ttxt = tesseract_text(variant)

        if len(ptxt) > len(engine_results["paddle"]):
            engine_results["paddle"] = ptxt
        if len(etxt) > len(engine_results["easyocr"]):
            engine_results["easyocr"] = etxt
        if len(ttxt) > len(engine_results["tesseract"]):
            engine_results["tesseract"] = ttxt

        candidate_texts.extend([ptxt, etxt, ttxt])

    longest = pick_longest(candidate_texts)
    merged = "\n".join(dedupe([longest, *engine_results.values()])).strip()

    if qr_codes:
        merged = f"{merged}\n" + "\n".join(qr_codes) if merged else "\n".join(qr_codes)
    if barcodes:
        merged = f"{merged}\n" + "\n".join(barcodes) if merged else "\n".join(barcodes)

    extracted = extract_fields(merged, image_quality=image_quality, qr_codes=qr_codes, barcodes=barcodes)
    extracted["engine_outputs"] = engine_results
    return extracted


def run_ocr_pipeline(path: str) -> dict[str, Any]:
    ext = os.path.splitext(path.lower())[1]

    if ext == ".pdf":
        embedded_text = parse_pdf_text(path)
        images = render_pdf_pages(path)

        per_page = []
        merged_parts = [embedded_text] if embedded_text else []
        qr_all = []
        barcode_all = []
        image_quality = "good"

        for image in images:
            result = run_ocr_on_image(image)
            per_page.append(result)
            if result.get("raw_text"):
                merged_parts.append(result["raw_text"])
            qr_all.extend(result.get("decoded_qr", []))
            barcode_all.extend(result.get("decoded_barcodes", []))
            if result.get("scan_quality") == "low":
                image_quality = "moderate" if image_quality == "good" else "low"

        combined_text = "\n".join([part for part in merged_parts if part]).strip()
        extracted = extract_fields(
            combined_text,
            image_quality=image_quality,
            qr_codes=dedupe(qr_all),
            barcodes=dedupe(barcode_all),
        )
        extracted["source_type"] = "pdf"
        extracted["pages_processed"] = len(images)
        extracted["multi_ocr_retry"] = True
        extracted["raw_text"] = combined_text
        extracted["quality"] = extracted.get("quality") or "low"
        return extracted

    image = cv2.imread(path)
    if image is None:
        raise ValueError("Failed to load image")

    extracted = run_ocr_on_image(image)
    extracted["source_type"] = "image"
    extracted["multi_ocr_retry"] = True
    return extracted
