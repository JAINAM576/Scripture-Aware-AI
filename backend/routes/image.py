"""
Image generation endpoint.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from services.moderator import is_safe
from services.image import generate_image

router = APIRouter()


class ImageRequest(BaseModel):
    prompt: str


class ImageResponse(BaseModel):
    image_url: str
    safe_prompt: str
    original_prompt: str
    blocked: bool = False


@router.post("/generate-image", response_model=ImageResponse)
def image_endpoint(req: ImageRequest):
    if not is_safe(req.prompt):
        return ImageResponse(
            image_url="",
            safe_prompt="",
            original_prompt=req.prompt,
            blocked=True,
        )
    result = generate_image(req.prompt)
    return ImageResponse(**result)
