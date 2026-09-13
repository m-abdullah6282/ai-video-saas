import asyncio
from app.rag.embeddings import get_embedding
from app.rag.asset_store import add_asset
from app.rag.retrieval import search_similar_assets


async def main():
    # Step A: Kuch fake assets "database" mein daalte hain
    sample_scripts = [
        ("script-1", "Elder mistreatment warning signs training video for care staff"),
        ("script-2", "How to bake a chocolate cake step by step"),
        ("script-3", "Adult social care safeguarding procedures overview"),
        ("script-4", "Fire safety evacuation drill for office buildings"),
        ("script-5", "Introduction to nursery playtime activities for toddlers"),
    ]

    for asset_id, text in sample_scripts:
        embedding = await get_embedding(text, task_type="RETRIEVAL_DOCUMENT")
        add_asset(asset_id, text, embedding)

    print("Assets added. Now searching...\n")

    # Step B: Naya query search karte hain
    query = "Create a safeguarding video for adult care workers"
    results = await search_similar_assets(query, top_k=3)

    print(f"Query: {query}\n")
    for r in results:
        print(f"  [{r['similarity']:.4f}] {r['id']}: {r['text']}")


asyncio.run(main())