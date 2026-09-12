from fastapi import APIRouter
from app.schemas import DashboardStats, VideoOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Abhi mock data — Phase 2 mein database query se replace hoga
_mock_stats = DashboardStats(
    videos_this_month=42,
    ai_spend_this_month=187.30,
    rag_savings_this_month=412.50,
    overall_reuse_rate=68,
)

_mock_videos = [
    VideoOut(
        id="v1",
        title="Five Signs of Safeguarding Concern",
        sector="Adult Care",
        country="UK",
        status="Ready for Review",
        created_at="2026-09-10",
        reuse_percentage=82,
    ),
    VideoOut(
        id="v2",
        title="Welcome to Our Nursery",
        sector="Early Years",
        country="UK",
        status="Approved",
        created_at="2026-09-08",
        reuse_percentage=55,
    ),
]


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    return _mock_stats


@router.get("/recent-videos", response_model=list[VideoOut])
async def get_recent_videos():
    return _mock_videos