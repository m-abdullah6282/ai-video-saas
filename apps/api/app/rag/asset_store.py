import sqlite3
import json

DB_PATH = "assets.db"


def init_db():
    """
    Creates the assets table if it doesn't already exist.
    Safe to call every time the app starts — CREATE TABLE IF NOT
    EXISTS won't touch existing data.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS assets (
            id TEXT PRIMARY KEY,
            text TEXT NOT NULL,
            sector TEXT NOT NULL,
            embedding TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def add_asset(asset_id: str, text: str, sector: str, embedding: list[float]):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT OR REPLACE INTO assets (id, text, sector, embedding) VALUES (?, ?, ?, ?)",
        (asset_id, text, sector, json.dumps(embedding)),
    )
    conn.commit()
    conn.close()


def get_all_assets() -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT id, text, sector, embedding FROM assets").fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "text": row[1],
            "sector": row[2],
            "embedding": json.loads(row[3]),
        }
        for row in rows
    ]