from fastapi import APIRouter

from app.services.image_captioner import ImageCaptioner

router = APIRouter()


@router.get("/health")
async def health_check():
    try:
        captioner = ImageCaptioner.get_instance()
        model_loaded = captioner.model is not None
    except Exception:
        model_loaded = False

    return {
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
        "model_name": captioner.model_name if model_loaded else None,
    }
