import numpy as np
from app.rag.embeddings import get_embedding
from app.rag.asset_store import get_all_assets


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


async def search_similar_assets(
    query: str, sector: str | None = None, top_k: int = 3
) -> list[dict]:
    """
    Given a text query, returns the top_k most semantically similar
    assets from the store, ranked by similarity score.

    If `sector` is given, only assets matching that sector are
    considered — this is a HARD FILTER applied before ranking,
    so an irrelevant-sector asset can never outrank a relevant one
    just because it happens to have a high embedding similarity.
    """
    query_embedding = await get_embedding(query, task_type="RETRIEVAL_QUERY")

    all_assets = get_all_assets()

    # STEP 1: HARD FILTER — sector must match, if one was given
    if sector is not None:
        candidates = [a for a in all_assets if a["sector"] == sector]
    else:
        candidates = all_assets

    # STEP 2: SOFT RANKING — only now do we compute similarity
    scored_assets = []
    for asset in candidates:
        score = cosine_similarity(query_embedding, asset["embedding"])
        scored_assets.append({
            "id": asset["id"],
            "text": asset["text"],
            "sector": asset["sector"],
            "similarity": score,
        })

    scored_assets.sort(key=lambda a: a["similarity"], reverse=True)

    return scored_assets[:top_k]