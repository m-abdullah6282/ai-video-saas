import asyncio
from app.rag.embeddings import get_embedding


async def main():
    text = "safeguarding concerns for adult care workers"
    vector = await get_embedding(text)

    print(f"Text: {text}")
    print(f"Vector length: {len(vector)}")
    print(f"First 5 numbers: {vector[:5]}")


asyncio.run(main())