import sqlite3
import json
from datetime import datetime

DB_PATH = "assets.db"


def init_video_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS videos (
            id TEXT PRIMARY KEY,
            organization_id TEXT NOT NULL,
            title TEXT NOT NULL,
            sector TEXT,
            country TEXT,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            reuse_percentage INTEGER,
            cost REAL,
            script TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS video_versions (
            id TEXT PRIMARY KEY,
            video_id TEXT NOT NULL,
            version_number INTEGER NOT NULL,
            script TEXT NOT NULL,
            change_description TEXT,
            changed_by TEXT,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def save_video(video_id: str, organization_id: str, title: str, sector: str, status: str,
                reuse_percentage: int, cost: float, script: str):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """INSERT INTO videos (id, organization_id, title, sector, country, status, created_at, reuse_percentage, cost, script)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (video_id, organization_id, title, sector, "UK", status, datetime.now().strftime("%Y-%m-%d"),
         reuse_percentage, cost, script),
    )
    # Naya — Version 1 bhi save karo
    version_id = f"{video_id}-v1"
    conn.execute(
        """INSERT INTO video_versions (id, video_id, version_number, script, change_description, changed_by, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (version_id, video_id, 1, script, "Original creation", organization_id, datetime.now().strftime("%Y-%m-%d %H:%M")),
    )
    conn.commit()
    conn.close()


def add_video_version(video_id: str, new_script: str, change_description: str, changed_by: str) -> int:
    conn = sqlite3.connect(DB_PATH)

    last_version = conn.execute(
        "SELECT MAX(version_number) FROM video_versions WHERE video_id = ?", (video_id,)
    ).fetchone()[0]
    new_version_number = (last_version or 0) + 1

    version_id = f"{video_id}-v{new_version_number}"
    conn.execute(
        """INSERT INTO video_versions (id, video_id, version_number, script, change_description, changed_by, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (version_id, video_id, new_version_number, new_script, change_description, changed_by, datetime.now().strftime("%Y-%m-%d %H:%M")),
    )

    # Main videos table ko bhi latest script se update karo
    conn.execute("UPDATE videos SET script = ? WHERE id = ?", (new_script, video_id))

    conn.commit()
    conn.close()
    return new_version_number


def get_video_versions(video_id: str) -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT version_number, script, change_description, changed_by, created_at FROM video_versions WHERE video_id = ? ORDER BY version_number ASC",
        (video_id,),
    ).fetchall()
    conn.close()

    return [
        {"version_number": r[0], "script": r[1], "change_description": r[2], "changed_by": r[3], "created_at": r[4]}
        for r in rows
    ]


def get_all_videos(organization_id: str) -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT id, title, sector, country, status, created_at, reuse_percentage, cost FROM videos WHERE organization_id = ? ORDER BY created_at DESC",
        (organization_id,),
    ).fetchall()
    conn.close()

    return [
        {
            "id": r[0], "title": r[1], "sector": r[2], "country": r[3],
            "status": r[4], "created_at": r[5], "reuse_percentage": r[6], "cost": r[7],
        }
        for r in rows
    ]


def get_dashboard_stats(organization_id: str) -> dict:
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute(
        "SELECT COUNT(*), COALESCE(SUM(cost), 0), AVG(reuse_percentage) FROM videos WHERE organization_id = ?",
        (organization_id,),
    ).fetchone()
    conn.close()

    count, total_spend, avg_reuse = row
    return {
        "videos_this_month": count,
        "ai_spend_this_month": round(total_spend, 2),
        "rag_savings_this_month": 0.0,
        "overall_reuse_rate": round(avg_reuse) if avg_reuse else 0,
    }

def get_video_by_id(video_id: str, organization_id: str) -> dict | None:
    conn = sqlite3.connect(DB_PATH)
    row = conn.execute(
        "SELECT id, title, sector, country, status, created_at, reuse_percentage, cost, script FROM videos WHERE id = ? AND organization_id = ?",
        (video_id, organization_id),
    ).fetchone()
    conn.close()

    if not row:
        return None

    return {
        "id": row[0], "title": row[1], "sector": row[2], "country": row[3],
        "status": row[4], "created_at": row[5], "reuse_percentage": row[6],
        "cost": row[7], "script": row[8],
    }