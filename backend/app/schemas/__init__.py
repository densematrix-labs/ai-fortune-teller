"""Pydantic schemas for request/response models."""

from pydantic import BaseModel, Field


class FortuneRequest(BaseModel):
    idea: str = Field(..., min_length=1, max_length=2000, description="创业想法描述")
    style: str = Field(
        default="tarot",
        pattern=r"^(tarot|yijing|zodiac|crystal)$",
        description="算命风格",
    )


class Scores(BaseModel):
    spread: int = Field(..., ge=0, le=100, description="传播运")
    funding: int = Field(..., ge=0, le=100, description="融资运")
    tech: int = Field(..., ge=0, le=100, description="技术运")
    users: int = Field(..., ge=0, le=100, description="用户运")
    competition: int = Field(..., ge=0, le=100, description="竞品运")


class FortuneResponse(BaseModel):
    fortune_level: str
    reading: str
    advice: list[str]
    scores: Scores
