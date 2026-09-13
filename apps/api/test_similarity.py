import asyncio
import numpy as np
from app.rag.embeddings import get_embedding


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    a = np.array(vec_a)
    b = np.array(vec_b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


async def main():
    text_1 = "safeguarding concerns for adult care workers"
    text_2 = "elder mistreatment warning signs training"
    text_3 = "how to bake a chocolate cake"

    emb_1 = await get_embedding(text_1)
    emb_2 = await get_embedding(text_2)
    emb_3 = await get_embedding(text_3)

    print(f"Similarity (safeguarding vs elder mistreatment): {cosine_similarity(emb_1, emb_2):.4f}")
    print(f"Similarity (safeguarding vs cake recipe):        {cosine_similarity(emb_1, emb_3):.4f}")


asyncio.run(main())