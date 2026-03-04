import cv2
import numpy as np
import pytesseract


def estimate_image_quality(image: np.ndarray) -> str:
    """Estimate image quality based on blur and contrast."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
    contrast = float(gray.std())

    if blur_score > 140 and contrast > 45:
        return "good"
    if blur_score > 60 and contrast > 25:
        return "moderate"
    return "low"


def auto_rotate_image(image: np.ndarray) -> np.ndarray:
    """Auto-rotate image using Tesseract OSD when available."""
    try:
        osd = pytesseract.image_to_osd(image)
        rotation = 0
        for line in osd.splitlines():
            if "Rotate:" in line:
                rotation = int(line.split(":", 1)[1].strip())
                break
        if rotation == 90:
            return cv2.rotate(image, cv2.ROTATE_90_COUNTERCLOCKWISE)
        if rotation == 180:
            return cv2.rotate(image, cv2.ROTATE_180)
        if rotation == 270:
            return cv2.rotate(image, cv2.ROTATE_90_CLOCKWISE)
    except Exception:
        pass
    return image


def deskew_image(gray: np.ndarray) -> np.ndarray:
    """Deskew image using minimal area rectangle of text pixels."""
    coords = np.column_stack(np.where(gray < 250))
    if coords.size == 0:
        return gray

    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    if abs(angle) < 0.8:
        return gray

    h, w = gray.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(gray, matrix, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def detect_text_regions(binary: np.ndarray) -> np.ndarray:
    """Highlight probable text regions for OCR retry."""
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 3))
    dilated = cv2.dilate(binary, kernel, iterations=1)
    return dilated


def preprocess_image(image: np.ndarray) -> dict:
    """Run preprocessing stack and return OCR-friendly variants."""
    rotated = auto_rotate_image(image)
    gray = cv2.cvtColor(rotated, cv2.COLOR_BGR2GRAY)
    denoised = cv2.fastNlMeansDenoising(gray, h=14)

    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    contrasted = clahe.apply(denoised)

    deskewed = deskew_image(contrasted)

    adaptive = cv2.adaptiveThreshold(
        deskewed,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        3,
    )
    otsu = cv2.threshold(deskewed, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    inverted = cv2.bitwise_not(otsu)
    text_regions = detect_text_regions(adaptive)

    return {
        "quality": estimate_image_quality(rotated),
        "variants": [
            rotated,
            cv2.cvtColor(deskewed, cv2.COLOR_GRAY2BGR),
            cv2.cvtColor(adaptive, cv2.COLOR_GRAY2BGR),
            cv2.cvtColor(otsu, cv2.COLOR_GRAY2BGR),
            cv2.cvtColor(inverted, cv2.COLOR_GRAY2BGR),
            cv2.cvtColor(text_regions, cv2.COLOR_GRAY2BGR),
        ],
    }
