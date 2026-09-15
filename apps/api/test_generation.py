import asyncio
from app.rag.asset_store import init_db
from app.rag.retrieval import search_similar_assets
from app.rag.generation import generate_script


async def main():
    init_db()
    query = "Create a safeguarding video for adult care workers"
    retrieved = await search_similar_assets(query, sector="Adult Care", top_k=2)
    script = await generate_script(query, retrieved)
    print("GENERATED SCRIPT:\n")
    print(script)


asyncio.run(main())