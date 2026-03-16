from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import image, health

app = FastAPI(
    title="CaptionAI Image Analysis Service",
    description="BLIP-based image captioning service for CaptionAI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image.router, prefix="/api/image", tags=["image"])
app.include_router(health.router, prefix="/api", tags=["health"])


@app.on_event("startup")
async def startup_event():
    from app.services.image_captioner import ImageCaptioner

    ImageCaptioner.get_instance()
    print("BLIP model loaded and ready!")
