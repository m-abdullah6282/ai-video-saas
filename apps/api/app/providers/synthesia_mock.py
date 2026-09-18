from app.providers.base import VideoProvider


class SynthesiaMockAdapter(VideoProvider):
    name = "synthesia"

    async def list_avatars(self) -> list[dict]:
        return [{"id": "syn-avatar-1", "provider": "synthesia", "name": "Synthesia Presenter"}]

    async def list_voices(self) -> list[dict]:
        return [{"id": "syn-voice-1", "provider": "synthesia"}]

    async def estimate_cost(self, job: dict) -> dict:
        return {
            "provider_generation_cost": 5.80,
            "other_ai_cost": 0.30,
            "internal_processing_cost": 0.10,
            "total_estimated": 6.20,
            "estimated_cost_without_reuse": 14.00,
            "estimated_saving": 7.80,
        }

    async def create_video(self, job: dict) -> dict:
        return {"provider": "synthesia", "external_job_id": "syn-job-456"}

    async def check_status(self, handle: dict) -> str:
        return "ready_for_review"

    async def download_video(self, handle: dict) -> bytes:
        return b""