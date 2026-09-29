from app.providers.heygen_mock import HeyGenMockAdapter
from app.providers.synthesia_mock import SynthesiaMockAdapter

_providers = {
    "heygen": HeyGenMockAdapter(),
    "synthesia": SynthesiaMockAdapter(),
}


async def choose_best_provider(job: dict) -> dict:
    estimates = {}
    for name, provider in _providers.items():
        estimates[name] = await provider.estimate_cost(job)

    cheapest_name = min(estimates, key=lambda p: estimates[p]["total_estimated"])

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
        "recommended_cost": estimates[cheapest_name]["total_estimated"],
        "all_estimates": {name: est["total_estimated"] for name, est in estimates.items()},
        "comparison_table": comparison,
    }