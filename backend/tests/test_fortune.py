"""Tests for fortune telling service."""

import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.fortune import generate_fortune, parse_llm_response
from app.schemas import FortuneRequest


MOCK_LLM_RESPONSE = json.dumps({
    "fortune_level": "上上签",
    "reading": "天时方面，市场正处于AI风口，天时地利兼备。地利方面，赛道虽然拥挤但仍有细分机会。人和方面，创始人气场与项目高度契合。塔罗牌面显示命运之轮正转向有利方向，星星牌高悬，预示着光明的未来。愚者踏上旅程，勇气与智慧并存，前方虽有挑战，但塔罗之力揭示最终将化险为夷。",
    "advice": [
        "命运之轮提示：在产品上线前，先做小范围用户验证",
        "星星牌指引：关注社交媒体传播，你的项目自带话题性",
        "力量牌告诫：技术壁垒是护城河，持续投入研发"
    ],
    "scores": {
        "spread": 85,
        "funding": 60,
        "tech": 90,
        "users": 75,
        "competition": 70
    }
})


class TestParseLLMResponse:
    def test_parse_plain_json(self):
        result = parse_llm_response(MOCK_LLM_RESPONSE)
        assert result["fortune_level"] == "上上签"
        assert len(result["advice"]) == 3

    def test_parse_json_with_code_block(self):
        wrapped = f"```json\n{MOCK_LLM_RESPONSE}\n```"
        result = parse_llm_response(wrapped)
        assert result["fortune_level"] == "上上签"

    def test_parse_json_with_bare_code_block(self):
        wrapped = f"```\n{MOCK_LLM_RESPONSE}\n```"
        result = parse_llm_response(wrapped)
        assert result["fortune_level"] == "上上签"

    def test_parse_invalid_json_raises(self):
        with pytest.raises(json.JSONDecodeError):
            parse_llm_response("not json at all")


class TestGenerateFortune:
    @pytest.mark.asyncio
    async def test_generate_fortune_success(self):
        mock_message = MagicMock()
        mock_message.content = MOCK_LLM_RESPONSE
        mock_choice = MagicMock()
        mock_choice.message = mock_message
        mock_response = MagicMock()
        mock_response.choices = [mock_choice]

        with patch("app.fortune.get_llm_client") as mock_client_fn:
            mock_client = MagicMock()
            mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
            mock_client_fn.return_value = mock_client

            request = FortuneRequest(idea="做一个AI算命App", style="tarot")
            result = await generate_fortune(request)

            assert result.fortune_level == "上上签"
            assert len(result.advice) == 3
            assert result.scores.spread == 85
            assert result.scores.tech == 90


class TestSchemas:
    def test_valid_request(self):
        req = FortuneRequest(idea="test idea", style="tarot")
        assert req.idea == "test idea"
        assert req.style == "tarot"

    def test_default_style(self):
        req = FortuneRequest(idea="test idea")
        assert req.style == "tarot"

    def test_invalid_style(self):
        with pytest.raises(Exception):
            FortuneRequest(idea="test", style="invalid")

    def test_empty_idea(self):
        with pytest.raises(Exception):
            FortuneRequest(idea="")
