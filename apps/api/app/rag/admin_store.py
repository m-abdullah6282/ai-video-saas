import sqlite3

DB_PATH = "assets.db"


def get_all_organizations_stats() -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("""
        SELECT organization_id, COUNT(*), COALESCE(SUM(cost), 0), AVG(reuse_percentage)
        FROM videos
        GROUP BY organization_id
    """).fetchall()
    conn.close()

    return [
        {
            "organization_id": r[0],
            "total_videos": r[1],
            "total_spend": round(r[2], 2),
            "avg_reuse_rate": round(r[3]) if r[3] else 0,
        }
        for r in rows
    ]


def get_all_videos_admin() -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("""
        SELECT id, organization_id, title, sector, country, status, created_at, reuse_percentage, cost
        FROM videos ORDER BY created_at DESC
    """).fetchall()
    conn.close()

    return [
        {
            "id": r[0], "organization_id": r[1], "title": r[2], "sector": r[3],
            "country": r[4], "status": r[5], "created_at": r[6],
            "reuse_percentage": r[7], "cost": r[8],
        }
        for r in rows
    ]


def get_all_assets_admin() -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT id, organization_id, text, sector FROM assets").fetchall()
    conn.close()

    return [
        {"id": r[0], "organization_id": r[1], "text": r[2], "sector": r[3]}
        for r in rows
    ]


def delete_asset_admin(asset_id: str) -> bool:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.execute("DELETE FROM assets WHERE id = ?", (asset_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted


def get_all_users_admin() -> list[dict]:
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute("SELECT email, organization_id, role FROM users").fetchall()
    conn.close()

    return [{"email": r[0], "organization_id": r[1], "role": r[2]} for r in rows]