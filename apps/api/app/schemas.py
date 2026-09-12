from pydantic import BaseModel


class DashboardStats(BaseModel):
    videos_this_month: int
    ai_spend_this_month: float
    rag_savings_this_month: float
    overall_reuse_rate: int


class VideoOut(BaseModel):
    id: str
    title: str
    sector: str
    country: str
    status: str
    created_at: str
    reuse_percentage: int