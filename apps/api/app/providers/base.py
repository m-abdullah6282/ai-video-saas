from abc import ABC, abstractmethod


class VideoProvider(ABC):
    @abstractmethod
    async def list_avatars(self) -> list[dict]:
        ...

    @abstractmethod
    async def list_voices(self) -> list[dict]:
        ...

    @abstractmethod
    async def estimate_cost(self, job: dict) -> dict:
        ...

    @abstractmethod
    async def create_video(self, job: dict) -> dict:
        ...

    @abstractmethod
    async def check_status(self, handle: dict) -> str:
        ...

    @abstractmethod
    async def download_video(self, handle: dict) -> bytes:
        ...