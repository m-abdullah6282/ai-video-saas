from app.providers.heygen_mock import HeyGenMockAdapter

_providers = {"heygen": HeyGenMockAdapter()}


async def calculate_cost_analysis(job: dict, reuse_info: dict) -> dict:
    """Section 13: combines provider cost estimate with reuse savings."""
    provider = _providers["heygen"]
    estimate = await provider.estimate_cost(job)

    reuse_pct = reuse_info["reuse_percentage"]
    cost_without_reuse = estimate["estimated_cost_without_reuse"]
    actual_cost = cost_without_reuse * (1 - reuse_pct / 100)
    saving = cost_without_reuse - actual_cost

    return {
        "estimated_total": round(actual_cost, 2),
        "cost_without_reuse": cost_without_reuse,
        "estimated_saving": round(saving, 2),
        "saving_percentage": reuse_pct,
    }