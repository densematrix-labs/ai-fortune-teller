"""
Prometheus Metrics for DenseMatrix Demo Tools
"""
from prometheus_client import Counter, Histogram
import os

TOOL_SLUG = os.getenv("TOOL_SLUG", "ai-fortune-teller")

# Payment metrics
PAYMENT_COUNTER = Counter(
    'creem_payment_total',
    'Total payment attempts',
    ['tool', 'status']
)

WEBHOOK_COUNTER = Counter(
    'creem_webhook_total',
    'Total webhook events received',
    ['tool', 'event']
)

# Generation metrics
GENERATION_COUNTER = Counter(
    'generation_total',
    'Total generation requests',
    ['tool', 'type']
)

TOKEN_CONSUMED = Counter(
    'generation_token_consumed',
    'Total tokens consumed',
    ['tool']
)

GENERATION_LATENCY = Histogram(
    'generation_latency_seconds',
    'Generation request latency',
    ['tool'],
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0, 60.0]
)


def record_payment(status: str):
    """Record a payment event. status: success, failed, pending"""
    PAYMENT_COUNTER.labels(tool=TOOL_SLUG, status=status).inc()


def record_webhook(event: str):
    """Record a webhook event."""
    WEBHOOK_COUNTER.labels(tool=TOOL_SLUG, event=event).inc()


def record_generation(gen_type: str = "free"):
    """Record a generation request. gen_type: free, paid"""
    GENERATION_COUNTER.labels(tool=TOOL_SLUG, type=gen_type).inc()


def record_token_consumed(count: int = 1):
    """Record token consumption"""
    TOKEN_CONSUMED.labels(tool=TOOL_SLUG).inc(count)


def generation_timer():
    """Context manager for timing generation requests"""
    return GENERATION_LATENCY.labels(tool=TOOL_SLUG).time()
