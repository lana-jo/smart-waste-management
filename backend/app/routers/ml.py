import io
import logging

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from PIL import Image

from app.config import get_settings
from app.deps import get_current_user
from app.models import User
from app.rate_limit import limiter
from app.services.storage import ImageValidationError, check_upload_size

logger = logging.getLogger("app.ml")

router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])
settings = get_settings()

CLASSES = ["Organic Waste", "Plastic Waste", "Paper Waste"]

model = None
np = None
img_to_array = None
load_model = None

try:
    import numpy as np  # type: ignore
    from tensorflow.keras.models import load_model  # type: ignore
    from tensorflow.keras.preprocessing.image import img_to_array  # type: ignore

    MODEL_PATH = settings.backend_dir / "waste_model.keras"
    try:
        model = load_model(MODEL_PATH, safe_mode=True)  # anti-unsafe-pickle
    except Exception:
        logger.exception("gagal memuat model ML")
        model = None
except Exception:
    logger.exception("dependensi ML tidak tersedia")
    model = None


@router.post("/predict")
@limiter.limit("30/minute")
async def predict_waste(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if model is None or np is None or img_to_array is None:
        raise HTTPException(status_code=503, detail="Model belum dimuat.")

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Bukan file gambar.")

    try:
        # check_upload_size menghabiskan stream; mundur ke posisi 0 sebelum baca.
        check_upload_size(file.file)
        file.file.seek(0)
    except ImageValidationError as failure:
        raise HTTPException(
            status_code=failure.status_code, detail=failure.message
        ) from None

    image = Image.open(io.BytesIO(await file.read())).convert("RGB").resize((224, 224))
    img_array = img_to_array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    preds = model.predict(img_array)[0]
    idx = int(np.argmax(preds))

    return {
        "predicted_class": CLASSES[idx],
        "confidence": float(preds[idx]),
        "probabilities": {CLASSES[i]: float(preds[i]) for i in range(len(CLASSES))},
    }
