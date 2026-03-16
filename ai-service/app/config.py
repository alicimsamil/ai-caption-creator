import os


class Settings:
    MODEL_NAME: str = os.getenv("MODEL_NAME", "Salesforce/blip-image-captioning-large")
    DEVICE: str = os.getenv("DEVICE", "cpu")
    MAX_IMAGE_SIZE: int = int(os.getenv("MAX_IMAGE_SIZE", "10485760"))  # 10MB
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))


settings = Settings()
