import asyncio
from app.rag.asset_store import init_db
from app.rag.retrieval import search_similar_assets
from app.rag.reuse_score import calculate_reuse_score
from app.rag.cost_engine import calculate_cost_analysis


async def main():
    init_db()
    query = "Create a safeguarding video for adult care workers"
    retrieved = await search_similar_assets(query, sector="Adult Care", top_k=3)
    reuse_info = calculate_reuse_score(retrieved)
    cost_info = await calculate_cost_analysis({"description": query}, reuse_info)

    print(f"Reuse: {reuse_info['reuse_percentage']}%")
    print(f"Cost: {cost_info}")


asyncio.run(main())