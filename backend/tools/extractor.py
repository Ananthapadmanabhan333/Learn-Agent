import pdfplumber
import pytesseract
from PIL import Image
import os
import io

def extract_text_from_pdf(filepath: str) -> str:
    """Extracts text from a given PDF file."""
    text = ""
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_image(filepath: str) -> str:
    """Extracts text from an image using OCR."""
    # Assuming Tesseract is installed on the system and in PATH
    try:
        image = Image.open(filepath)
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return f"Error extracting text from image: {str(e)}"

def extract_text_from_txt(filepath: str) -> str:
    """Extracts text from a standard text file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def process_file_upload(filepath: str, file_type: str) -> str:
    if file_type == 'pdf':
        return extract_text_from_pdf(filepath)
    elif file_type in ['png', 'jpg', 'jpeg']:
        return extract_text_from_image(filepath)
    elif file_type == 'txt':
        return extract_text_from_txt(filepath)
    else:
        raise ValueError("Unsupported file type")
