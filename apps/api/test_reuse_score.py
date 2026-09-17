import asyncio
from app.rag.asset_store import init_db
from app.rag.retrieval import search_similar_assets
from app.rag.reuse_score import calculate_reuse_score


async def main():
    init_db()
    query = "Create a safeguarding video for adult care workers"
    retrieved = await search_similar_assets(query, sector="Adult Care", top_k=3)
    reuse_info = calculate_reuse_score(retrieved)

    print(f"Query: {query}\n")
    print(f"Reuse: {reuse_info['reuse_percentage']}%")
    print(f"New Generation: {reuse_info['new_generation_percentage']}%")
    print(f"Usable assets: {reuse_info['usable_assets']}")


asyncio.run(main())