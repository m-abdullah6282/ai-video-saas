from app.providers.heygen_mock import HeyGenMockAdapter
from app.providers.synthesia_mock import SynthesiaMockAdapter

_providers = {
    "heygen": HeyGenMockAdapter(),
    "synthesia": SynthesiaMockAdapter(),
}


async def choose_best_provider(job: dict) -> dict:
    """
    Section 11: Provider Decision Engine.
    Compares cost estimates across all providers and recommends
    the cheapest option — a simple, deterministic rule.
    Future: could also factor in quality, speed, availability.
    """
    estimates = {}
    for name, provider in _providers.items():
        estimates[name] = await provider.estimate_cost(job)

    cheapest_name = min(estimates, key=lambda p: estimates[p]["total_estimated"])

    return {
        "recommended_provider": cheapest_name,
        "recommended_cost": estimates[cheapest_name]["total_estimated"],
        "all_estimates": {name: est["total_estimated"] for name, est in estimates.items()},
    }