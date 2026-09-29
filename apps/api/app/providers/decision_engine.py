from app.providers.heygen_mock import HeyGenMockAdapter
from app.providers.synthesia_mock import SynthesiaMockAdapter

_providers = {
    "heygen": HeyGenMockAdapter(),
    "synthesia": SynthesiaMockAdapter(),
}


async def choose_best_provider(job: dict) -> dict:
    """
    Compares cost estimates across all providers and recommends the cheapest.
    Estimates come from each adapter's estimate_cost(); when a real adapter
    replaces a mock, the same structure is returned.
    """
    estimates = {}
    for name, provider in _providers.items():
        estimates[name] = await provider.estimate_cost(job)

    cheapest_name = min(estimates, key=lambda p: estimates[p]["total_estimated"])
    best = estimates[cheapest_name]

    comparison = [
        {
            "provider": name,
            "total_cost": est["total_estimated"],
            "recommended": name == cheapest_name,
        }
        for name, est in estimates.items()
    ]

    return {
        "recommended_provider": cheapest_name,
        "recommended_cost": best["total_estimated"],
        "breakdown": {
            "provider_generation_cost": best.get("provider_generation_cost"),
            "other_ai_cost": best.get("other_ai_cost"),
            "internal_processing_cost": best.get("internal_processing_cost"),
            "total_estimated": best["total_estimated"],
        },
        "all_estimates": {name: est["total_estimated"] for name, est in estimates.items()},
        "comparison_table": comparison,
    }