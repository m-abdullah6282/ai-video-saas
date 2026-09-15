import asyncio
from app.rag.embeddings import get_embedding
from app.rag.asset_store import init_db, add_asset
from app.rag.retrieval import search_similar_assets


async def main():
    init_db()

    sample_scripts = [
        ("script-1", "Elder mistreatment warning signs training video for care staff", "Adult Care"),
        ("script-2", "How to bake a chocolate cake step by step", "Other"),
        ("script-3", "Adult social care safeguarding procedures overview", "Adult Care"),
        ("script-4", "Fire safety evacuation drill for office buildings", "Corporate"),
        ("script-5", "Introduction to nursery playtime activities for toddlers", "Early Years"),
    ]

    for asset_id, text, sector in sample_scripts:
        embedding = await get_embedding(text, task_type="RETRIEVAL_DOCUMENT")
        add_asset(asset_id, text, sector, embedding)

    print("Assets added. Now searching WITH sector filter...\n")

    query = "Hpw are you"
    results = await search_similar_assets(query, sector="Adult Care", top_k=3)

    print(f"Query: {query}  (sector filter: Adult Care)\n")
    for r in results:
        print(f"  [{r['similarity']:.4f}] {r['id']} ({r['sector']}): {r['text']}")


asyncio.run(main())