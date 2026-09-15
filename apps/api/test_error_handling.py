import asyncio
from app.rag.embeddings import get_embedding


async def main():
    # Test 1: Normal case (should work)
    try:
        vec = await get_embedding("test text")
        print(f"✓ Normal case worked, vector length: {len(vec)}")
    except Exception as e:
        print(f"✗ Normal case failed: {e}")

    # Test 2: Empty string (should raise ValueError)
    try:
        await get_embedding("")
        print("✗ Empty string should have raised an error but didn't")
    except ValueError as e:
        print(f"✓ Empty string correctly rejected: {e}")


asyncio.run(main())