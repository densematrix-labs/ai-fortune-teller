"""Backward-compatible config — delegates to app.core.config."""
from app.core.config import settings

LLM_PROXY_URL = settings.LLM_PROXY_URL
LLM_PROXY_KEY = settings.LLM_PROXY_KEY
LLM_MODEL = settings.LLM_MODEL
