import os
from dotenv import load_dotenv

load_dotenv()

LLM_PROXY_URL = os.getenv("LLM_PROXY_URL", "https://llm-proxy.densematrix.ai")
LLM_PROXY_KEY = os.getenv("LLM_PROXY_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gemini-2.5-flash")
