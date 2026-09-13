import numpy as np
from app.rag.embeddings import get_embedding
from app.rag.asset_store import get_all_assets


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


async def search_similar_assets(query: str, top_k: int = 3) -> list[dict]:
    """
    Given a text query, returns the top_k most semantically similar
    assets from the store, ranked by similarity score.
    """
    query_embedding = await get_embedding(query, task_type="RETRIEVAL_QUERY")

    all_assets = get_all_assets()

    scored_assets = []
    for asset in all_assets:
        score = cosine_similarity(query_embedding, asset["embedding"])
        scored_assets.append({
            "id": asset["id"],
            "text": asset["text"],
            "similarity": score,
        })

    scored_assets.sort(key=lambda a: a["similarity"], reverse=True)

    return scored_assets[:top_k]