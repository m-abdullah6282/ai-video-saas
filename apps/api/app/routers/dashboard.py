from fastapi import APIRouter
from app.schemas import DashboardStats, VideoOut
from app.rag.video_store import get_all_videos, get_dashboard_stats as get_real_stats

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    return get_real_stats()


@router.get("/recent-videos", response_model=list[VideoOut])
async def get_recent_videos():
    videos = get_all_videos()[:5]
    return videos

from app.rag.video_store import get_all_videos

@router.get("/library")
async def get_video_library():
    return get_all_videos()