from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch

from app.config import settings


class ImageCaptioner:
    _instance = None

    def __init__(self):
        self.model_name = settings.MODEL_NAME
        self.device = settings.DEVICE

        print(f"Loading BLIP model: {self.model_name} on {self.device}")
        self.processor = BlipProcessor.from_pretrained(self.model_name)
        self.model = BlipForConditionalGeneration.from_pretrained(self.model_name)
        self.model.to(self.device)
        self.model.eval()
        print("BLIP model loaded successfully!")

    @classmethod
    def get_instance(cls) -> "ImageCaptioner":
        if cls._instance is None:
            cls._instance = ImageCaptioner()
        return cls._instance

    def generate_caption(self, image: Image.Image, max_length: int = 100) -> str:
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)

        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                max_length=max_length,
                num_beams=5,
                early_stopping=True,
            )

        caption = self.processor.decode(output[0], skip_special_tokens=True)
        return caption

    def generate_conditional_caption(
        self, image: Image.Image, text: str, max_length: int = 100
    ) -> str:
        inputs = self.processor(
            images=image, text=text, return_tensors="pt"
        ).to(self.device)

        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                max_length=max_length,
                num_beams=5,
                early_stopping=True,
            )

        caption = self.processor.decode(output[0], skip_special_tokens=True)
        return caption
