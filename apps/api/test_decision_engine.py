import asyncio
from app.providers.decision_engine import choose_best_provider


async def main():
    result = await choose_best_provider({"description": "safeguarding video"})
    print(result)


asyncio.run(main())