"""FastAPI application for AI Fortune Teller."""

from contextlib import asynccontextmanager
from typing import Optional
import logging

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db, init_db
from app.models import GenerationToken, FreeTrialTracking
from app.fortune import generate_fortune
from app.schemas import FortuneRequest, FortuneResponse
from app.api.payment import router as payment_router
from app.api.tokens import router as tokens_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database tables on startup."""
    await init_db()
    yield


app = FastAPI(title="AI 创业算命师", version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register payment and token routers under /api
app.include_router(payment_router, prefix="/api")
app.include_router(tokens_router, prefix="/api")


class FortuneRequestWithAuth(FortuneRequest):
    device_id: Optional[str] = None
    token: Optional[str] = None


class TrialStatusResponse:
    pass


from pydantic import BaseModel


class TrialStatusResponse(BaseModel):
    has_free_trial: bool
    uses_remaining: int


async def check_and_use_free_trial(device_id: str, db: AsyncSession) -> bool:
    """Check if device has free trial remaining. If so, consume one use."""
    if not device_id:
        return False

    result = await db.execute(
        select(FreeTrialTracking).where(FreeTrialTracking.device_id == device_id)
    )
    tracking = result.scalar_one_or_none()

    if tracking is None:
        tracking = FreeTrialTracking(device_id=device_id, uses_count=1)
        db.add(tracking)
        await db.commit()
        return True
    elif tracking.uses_count < settings.FREE_TRIAL_LIMIT:
        tracking.uses_count += 1
        await db.commit()
        return True
    else:
        return False


async def check_and_use_token(token_str: str, db: AsyncSession) -> bool:
    """Validate token and consume one generation."""
    if not token_str:
        return False

    result = await db.execute(
        select(GenerationToken).where(GenerationToken.token == token_str)
    )
    token_obj = result.scalar_one_or_none()

    if token_obj and token_obj.use_generation():
        await db.commit()
        return True
    return False


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-fortune-teller"}


@app.get("/api/trial-status/{device_id}", response_model=TrialStatusResponse)
async def get_trial_status(device_id: str, db: AsyncSession = Depends(get_db)):
    """Check free trial status for a device."""
    result = await db.execute(
        select(FreeTrialTracking).where(FreeTrialTracking.device_id == device_id)
    )
    tracking = result.scalar_one_or_none()

    if tracking is None:
        return TrialStatusResponse(has_free_trial=True, uses_remaining=settings.FREE_TRIAL_LIMIT)
    else:
        remaining = max(0, settings.FREE_TRIAL_LIMIT - tracking.uses_count)
        return TrialStatusResponse(has_free_trial=remaining > 0, uses_remaining=remaining)


@app.post("/api/fortune", response_model=FortuneResponse)
async def get_fortune(request: FortuneRequestWithAuth, db: AsyncSession = Depends(get_db)):
    """Generate fortune — with token consumption logic."""
    # 1. Try paid token first
    if request.token:
        if await check_and_use_token(request.token, db):
            pass  # Authorized via token
        else:
            raise HTTPException(
                status_code=402,
                detail="Token 无效、已过期或已用完"
            )
    # 2. Try free trial
    elif request.device_id:
        if not await check_and_use_free_trial(request.device_id, db):
            raise HTTPException(
                status_code=402,
                detail="免费试用已用完，请购买算命次数继续使用"
            )
    else:
        raise HTTPException(
            status_code=400,
            detail="需要提供 device_id（免费试用）或 token（付费使用）"
        )

    # Execute fortune telling
    try:
        # Create a base FortuneRequest for generate_fortune
        base_request = FortuneRequest(idea=request.idea, style=request.style)
        result = await generate_fortune(base_request)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"算命失败: {e}")
        raise HTTPException(status_code=500, detail=f"算命失败：{str(e)}")
