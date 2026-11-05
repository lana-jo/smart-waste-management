import re
import uuid
from pathlib import Path

from fastapi import UploadFile
from PIL import Image, UnidentifiedImageError

from app.config import MAX_UPLOAD_BYTES, get_settings

ALLOWED_EXTENSIONS = {".jpg": "JPEG", ".jpeg": "JPEG", ".png": "PNG", ".webp": "WEBP"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
PUBLIC_URL_PREFIX = "/uploads/"
IMAGE_URL_PATTERN = re.compile(r"^/uploads/[A-Za-z0-9._-]+$")
IO_CHUNK_BYTES = 256 * 1024
WRONG_FORMAT_MESSAGE = "Format foto harus JPG, JPEG, PNG, atau WEBP."
CORRUPT_MESSAGE = "Foto rusak atau bukan file gambar yang valid."
SIZE_LIMIT_MB = MAX_UPLOAD_BYTES // (1024 * 1024)
SIZE_EXCEEDED_MESSAGE = f"Ukuran foto maksimal {SIZE_LIMIT_MB} MB."

settings = get_settings()


class ImageValidationError(Exception):
    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def check_upload_size(stream) -> None:
    streamed_bytes = 0
    while chunk := stream.read(IO_CHUNK_BYTES):
        streamed_bytes += len(chunk)
        if streamed_bytes >= MAX_UPLOAD_BYTES:
            raise ImageValidationError(SIZE_EXCEEDED_MESSAGE, status_code=413)


def _verify_image_content(stream, extension: str) -> None:
    expected_format = ALLOWED_EXTENSIONS[extension]
    try:
        stream.seek(0)
        with Image.open(stream) as opened_image:
            opened_image.verify()
        stream.seek(0)
        with Image.open(stream) as reopened_image:
            if reopened_image.format != expected_format:
                raise ImageValidationError(WRONG_FORMAT_MESSAGE)
    except (UnidentifiedImageError, OSError):
        raise ImageValidationError(CORRUPT_MESSAGE) from None
    except ImageValidationError:
        raise
    finally:
        stream.seek(0)


def validate_and_save_image(upload: UploadFile) -> str:
    file_extension = Path(upload.filename or "").suffix.lower()
    if file_extension not in ALLOWED_EXTENSIONS:
        raise ImageValidationError(WRONG_FORMAT_MESSAGE)
    if upload.content_type not in ALLOWED_MIME_TYPES:
        raise ImageValidationError(WRONG_FORMAT_MESSAGE)

    check_upload_size(upload.file)
    _verify_image_content(upload.file, file_extension)
    settings.upload_root.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}{file_extension}"
    upload.file.seek(0)
    with (settings.upload_root / stored_name).open("wb") as sink:
        while chunk := upload.file.read(IO_CHUNK_BYTES):
            sink.write(chunk)
    return f"{PUBLIC_URL_PREFIX}{stored_name}"


def delete_report_image(image_url: str) -> None:
    if not IMAGE_URL_PATTERN.fullmatch(image_url or ""):
        return
    stored_name = image_url[len(PUBLIC_URL_PREFIX) :]
    upload_root = settings.upload_root.resolve()
    candidate_path = (settings.upload_root / stored_name).resolve()
    if not candidate_path.is_relative_to(upload_root) or not candidate_path.is_file():
        return
    try:
        candidate_path.unlink()
    except OSError:
        pass
