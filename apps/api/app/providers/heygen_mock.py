from app.providers.base import VideoProvider


class HeyGenMockAdapter(VideoProvider):
    name = "heygen"

    async def list_avatars(self) -> list[dict]:
        return [
            {
                "id": "mock-avatar-1",
                "organization_id": "demo-org",
                "provider": "heygen",
                "provider_avatar_id": "hg-avatar-001",
                "name": "Professional UK Presenter",
                "sector": ["adult-care", "corporate"],
                "country": ["UK"],
                "language": ["en-GB"],
                "previous_usage_count": 3,
            }
        ]

    async def list_voices(self) -> list[dict]:
        return [
            {
                "id": "mock-voice-1",
                "provider": "heygen",
                "provider_voice_id": "hg-voice-001",
                "language": "en-GB",
                "accent": "British",
                "tone": "professional-reassuring",
            }
        ]

    async def estimate_cost(self, job: dict) -> dict:
        return {
            "provider_generation_cost": 4.20,
            "other_ai_cost": 0.40,
            "internal_processing_cost": 0.10,
            "total_estimated": 4.70,
            "estimated_cost_without_reuse": 11.80,
            "estimated_saving": 7.10,
        }

    async def create_video(self, job: dict) -> dict:
        return {"provider": "heygen", "external_job_id": "mock-job-123"}

    async def check_status(self, handle: dict) -> str:
        return "ready_for_review"

    async def download_video(self, handle: dict) -> bytes:
        return b""