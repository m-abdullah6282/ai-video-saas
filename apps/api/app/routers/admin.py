from fastapi import APIRouter, Depends, HTTPException
from app.auth import require_admin
from app.rag.admin_store import (
    get_all_organizations_stats,
    get_all_videos_admin,
    get_all_assets_admin,
    delete_asset_admin,
    get_all_users_admin,
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/organizations")
async def list_organizations(admin: dict = Depends(require_admin)):
    return get_all_organizations_stats()


@router.get("/videos")
async def list_all_videos(admin: dict = Depends(require_admin)):
    return get_all_videos_admin()


@router.get("/assets")
async def list_all_assets(admin: dict = Depends(require_admin)):
    return get_all_assets_admin()


@router.delete("/assets/{asset_id}")
async def delete_asset(asset_id: str, admin: dict = Depends(require_admin)):
    deleted = delete_asset_admin(asset_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {"status": "deleted", "asset_id": asset_id}


@router.get("/users")
async def list_users(admin: dict = Depends(require_admin)):
    return get_all_users_admin()