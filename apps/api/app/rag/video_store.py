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
    conn.commit()
    conn.close()


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