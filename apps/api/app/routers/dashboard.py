from fastapi import APIRouter, Depends
from app.schemas import DashboardStats, VideoOut
from app.rag.video_store import get_all_videos, get_dashboard_stats as get_real_stats
from app.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    return get_real_stats(current_user["organization_id"])


@router.get("/recent-videos", response_model=list[VideoOut])
async def get_recent_videos(current_user: dict = Depends(get_current_user)):
    videos = get_all_videos(current_user["organization_id"])[:5]
    return videos