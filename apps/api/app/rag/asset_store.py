
_assets: list[dict] = []


def add_asset(asset_id: str, text: str, embedding: list[float]):
    _assets.append({
        "id": asset_id,
        "text": text,
        "embedding": embedding,
    })


def get_all_assets() -> list[dict]:
    return _assets