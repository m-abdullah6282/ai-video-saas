import asyncio
from app.rag.embeddings import get_embedding
from app.rag.asset_store import init_db, add_asset


async def main():
    init_db()

    avatars = [
        ("avatar-1", "Professional female presenter, mid-30s, business attire, warm smile, suitable for corporate and healthcare training", "Adult Care", "avatar"),
        ("avatar-2", "Friendly male presenter, casual attire, approachable tone, suitable for early years and nursery content", "Early Years", "avatar"),
        ("avatar-3", "Formal male presenter, business suit, authoritative tone, suitable for corporate and compliance training", "Other", "avatar"),
    ]

    backgrounds = [
        ("bg-1", "Modern care home living room, warm lighting, comfortable furniture, elderly-friendly setting", "Adult Care", "background"),
        ("bg-2", "Bright nursery classroom, colorful decorations, child-safe furniture, playful atmosphere", "Early Years", "background"),
        ("bg-3", "Professional office boardroom, clean modern design, neutral colors, corporate setting", "Other", "background"),
    ]

    for asset_id, text, sector, asset_type in avatars + backgrounds:
        embedding = await get_embedding(text, task_type="RETRIEVAL_DOCUMENT")
        add_asset(asset_id, "org-1", text, sector, embedding, asset_type)
        print(f"Added {asset_type}: {asset_id}")

    print("\nDone. Seeded 3 avatars and 3 backgrounds for org-1.")


asyncio.run(main())