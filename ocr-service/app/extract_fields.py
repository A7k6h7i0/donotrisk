import re
import unicodedata
from datetime import datetime

BRANDS = [
    "LG",
    "Samsung",
    "Sony",
    "Bosch",
    "Whirlpool",
    "Haier",
    "Godrej",
    "Panasonic",
    "Philips",
    "Lenovo",
    "HP",
    "Dell",
    "Asus",
]

PRODUCT_KEYWORDS = {
    "refrigerator": "Refrigerator",
    "fridge": "Refrigerator",
    "washing machine": "Washing Machine",
    "air conditioner": "Air Conditioner",
    "ac": "Air Conditioner",
    "microwave": "Microwave",
    "laptop": "Laptop",
    "notebook": "Laptop",
    "television": "Television",
    "smart tv": "Television",
    "tv": "Television",
}

LABEL_GROUPS = {
    "model_number": ["model number", "model no", "model", "m/n", "mdl"],
    "serial_number": ["serial number", "serial no", "serial", "s/n", "sn"],
    "production_date": ["production date", "mfg date", "manufactured", "year of manufacture", "production"],
    "purchase_date": ["date of purchase", "purchase date", "invoice date", "bill date", "purchased on"],
    "warranty_duration": ["warranty", "guarantee", "warranty period", "coverage"],
}

MODEL_PATTERN = re.compile(r"\b[A-Z]{2,}[A-Z0-9]{4,}(?:/[A-Z0-9]+)?\b")
SERIAL_PATTERN = re.compile(r"\b[A-Z0-9]{10,15}\b")
PRODUCTION_YEAR_PATTERN = re.compile(r"\b(?:19|20)\d{2}\b")
PURCHASE_DATE_PATTERN = re.compile(r"\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b")
WARRANTY_PATTERN = re.compile(r"\b(\d+)\s*(year|years|month|months)\b", re.IGNORECASE)


def normalize_text(text: str) -> str:
    if not text:
        return ""
    normalized = unicodedata.normalize("NFKD", text)
    return "".join(ch for ch in normalized if not unicodedata.combining(ch))


def clean_text(text: str) -> str:
    text = normalize_text(text)
    text = text.replace("\x0c", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n", text)
    return text.strip()


def to_lines(text: str) -> list[str]:
    return [line.strip(" -:|\t") for line in text.splitlines() if line.strip()]


def value_after_label(line: str, labels: list[str]) -> str:
    low = line.lower()
    for label in labels:
        if label in low:
            parts = re.split(r":|\-", line, maxsplit=1)
            if len(parts) > 1:
                return parts[1].strip()
            return line
    return ""


def extract_labeled_value(lines: list[str], target: str) -> str:
    labels = LABEL_GROUPS[target]
    for idx, line in enumerate(lines):
        candidate = value_after_label(line, labels)
        if not candidate:
            continue

        if target == "model_number":
            match = MODEL_PATTERN.search(candidate.upper())
            if match:
                return match.group(0)
        elif target == "serial_number":
            match = SERIAL_PATTERN.search(candidate.upper())
            if match:
                return match.group(0)
        elif target == "production_date":
            match = PRODUCTION_YEAR_PATTERN.search(candidate)
            if match:
                return match.group(0)
        elif target == "purchase_date":
            match = PURCHASE_DATE_PATTERN.search(candidate)
            if match:
                return normalize_date(match.group(0))
        elif target == "warranty_duration":
            match = WARRANTY_PATTERN.search(candidate)
            if match:
                return f"{match.group(1)} {match.group(2).lower()}"

        if idx + 1 < len(lines):
            nxt = lines[idx + 1]
            if target == "model_number":
                m = MODEL_PATTERN.search(nxt.upper())
                if m:
                    return m.group(0)
            if target == "serial_number":
                m = SERIAL_PATTERN.search(nxt.upper())
                if m:
                    return m.group(0)

    return ""


def extract_brand(text: str) -> str | None:
    low = text.lower()
    for brand in BRANDS:
        if brand.lower() in low:
            return brand
    return None


def classify_product_name(text: str) -> str | None:
    low = text.lower()
    for keyword, label in PRODUCT_KEYWORDS.items():
        if keyword in low:
            return label
    return None


def normalize_date(value: str) -> str:
    value = value.replace("/", "-")
    parts = value.split("-")
    if len(parts) != 3:
        return value

    day, month, year = parts
    if len(year) == 2:
        year = f"20{year}" if int(year) < 50 else f"19{year}"

    try:
        return datetime(int(year), int(month), int(day)).date().isoformat()
    except Exception:
        return value


def extract_fields(raw_text: str, image_quality: str | None = None, qr_codes: list[str] | None = None, barcodes: list[str] | None = None) -> dict:
    cleaned = clean_text(raw_text)
    lines = to_lines(cleaned)
    text_upper = cleaned.upper()

    model_number = extract_labeled_value(lines, "model_number")
    if not model_number:
        m = MODEL_PATTERN.search(text_upper)
        model_number = m.group(0) if m else ""

    serial_number = extract_labeled_value(lines, "serial_number")
    if not serial_number:
        candidates = [m.group(0) for m in SERIAL_PATTERN.finditer(text_upper)]
        serial_number = next((x for x in candidates if re.search(r"[A-Z]", x) and re.search(r"\d", x)), "")

    production_date = extract_labeled_value(lines, "production_date")
    if not production_date:
        m = PRODUCTION_YEAR_PATTERN.search(cleaned)
        production_date = m.group(0) if m else ""

    purchase_date = extract_labeled_value(lines, "purchase_date")
    if not purchase_date:
        m = PURCHASE_DATE_PATTERN.search(cleaned)
        purchase_date = normalize_date(m.group(0)) if m else ""

    warranty_duration = extract_labeled_value(lines, "warranty_duration")
    if not warranty_duration:
        m = WARRANTY_PATTERN.search(cleaned)
        warranty_duration = f"{m.group(1)} {m.group(2).lower()}" if m else ""

    brand = extract_brand(cleaned)
    product_name = classify_product_name(cleaned)

    quality = "good" if model_number and serial_number else "moderate" if model_number or serial_number else "low"

    if image_quality == "low" and quality == "good":
        quality = "moderate"

    return {
        "brand": brand,
        "product_name": product_name,
        "model_number": model_number or None,
        "serial_number": serial_number or None,
        "production_date": production_date or None,
        "purchase_date": purchase_date or None,
        "warranty_duration": warranty_duration or None,
        "quality": quality,
        "scan_quality": image_quality or quality,
        "decoded_qr": qr_codes or [],
        "decoded_barcodes": barcodes or [],
        "raw_text": cleaned,
    }
