import numpy as np
from app.rag.embeddings import get_embedding
from app.rag.asset_store import get_all_assets


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


async def search_similar_assets(
    query: str, organization_id: str, sector: str | None = None,
    asset_type: str | None = None, top_k: int = 3
) -> list[dict]:
    if not query or not query.strip():
        raise ValueError("Query cannot be empty")
    if top_k < 1:
        raise ValueError("top_k must be at least 1")

    query_embedding = await get_embedding(query, task_type="RETRIEVAL_QUERY")
    all_assets = get_all_assets(organization_id, asset_type=asset_type)

    if sector is not None:
        candidates = [a for a in all_assets if a["sector"] == sector]
    else:
        candidates = all_assets

    scored_assets = []
    for asset in candidates:
        score = cosine_similarity(query_embedding, asset["embedding"])
        scored_assets.append({
            "id": asset["id"], "text": asset["text"], "sector": asset["sector"],
            "asset_type": asset["asset_type"], "similarity": score,
        })

    scored_assets.sort(key=lambda a: a["similarity"], reverse=True)
    return scored_assets[:top_k]
#admib pannel done