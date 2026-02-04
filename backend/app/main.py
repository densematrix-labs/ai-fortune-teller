"""FastAPI application for AI Fortune Teller."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .fortune import generate_fortune
from .schemas import FortuneRequest, FortuneResponse

app = FastAPI(title="AI 创业算命师", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/api/fortune", response_model=FortuneResponse)
async def get_fortune(request: FortuneRequest):
    try:
        result = await generate_fortune(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"算命失败：{str(e)}")
