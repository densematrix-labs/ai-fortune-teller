"""Fortune telling service using LLM."""

import json
import re

from openai import AsyncOpenAI

from .config import LLM_MODEL, LLM_PROXY_KEY, LLM_PROXY_URL
from .prompts import SYSTEM_PROMPTS, USER_PROMPT_TEMPLATE
from .schemas import FortuneRequest, FortuneResponse, Scores


def get_llm_client() -> AsyncOpenAI:
    """Create an OpenAI client pointing to the LLM proxy."""
    return AsyncOpenAI(
        base_url=LLM_PROXY_URL,
        api_key=LLM_PROXY_KEY,
    )


def parse_llm_response(content: str) -> dict:
    """Parse LLM response, handling potential markdown code blocks."""
    text = content.strip()
    # Remove markdown code block if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        text = match.group(1).strip()
    return json.loads(text)


async def generate_fortune(request: FortuneRequest) -> FortuneResponse:
    """Generate a fortune reading for the given startup idea."""
    client = get_llm_client()
    system_prompt = SYSTEM_PROMPTS.get(request.style, SYSTEM_PROMPTS["tarot"])
    user_prompt = USER_PROMPT_TEMPLATE.format(idea=request.idea)

    response = await client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.9,
        max_tokens=2000,
    )

    content = response.choices[0].message.content or ""
    data = parse_llm_response(content)

    return FortuneResponse(
        fortune_level=data["fortune_level"],
        reading=data["reading"],
        advice=data["advice"][:3],
        scores=Scores(**data["scores"]),
    )
