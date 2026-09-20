import sqlite3
import json

DB_PATH = "assets.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS assets (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL,
            text TEXT NOT NULL,
            sector TEXT NOT NULL,
            embedding TEXT NOT NULL,
            asset_type TEXT NOT NULL DEFAULT 'script'
        )
    """)
    conn.commit()
    conn.close()


def add_asset(asset_id: str, organization_id: str, text: str, sector: str, embedding: list[float], asset_type: str = "script"):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT OR REPLACE INTO assets (id, organization_id, text, sector, embedding, asset_type) VALUES (?, ?, ?, ?, ?, ?)",
        (asset_id, organization_id, text, sector, json.dumps(embedding), asset_type),
    )
    conn.commit()
    conn.close()


def get_all_assets(organization_id: str, asset_type: str | None = None) -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    if asset_type:
        rows = conn.execute(
            "SELECT id, text, sector, embedding, asset_type FROM assets WHERE organization_id = ? AND asset_type = ?",
            (organization_id, asset_type),
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT id, text, sector, embedding, asset_type FROM assets WHERE organization_id = ?",
            (organization_id,),
        ).fetchall()
    conn.close()

    return [
        {"id": r[0], "text": r[1], "sector": r[2], "embedding": json.loads(r[3]), "asset_type": r[4]}
        for r in rows
    ]