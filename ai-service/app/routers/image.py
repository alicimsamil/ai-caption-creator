from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
import io

from app.services.image_captioner import ImageCaptioner
from app.config import settings

router = APIRouter()


@router.post("/caption")
async def caption_image(image: UploadFile = File(...)):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await image.read()
    if len(contents) > settings.MAX_IMAGE_SIZE:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")

    try:
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    captioner = ImageCaptioner.get_instance()
    description = captioner.generate_caption(pil_image)

    return {
        "description": description,
        "filename": image.filename,
        "size": len(contents),
    }
