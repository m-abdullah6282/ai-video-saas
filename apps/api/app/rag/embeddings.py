import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

EMBEDDING_MODEL = "models/gemini-embedding-001"


async def get_embedding(text: str ,task_type: str = "SEMANTIC_SIMILARITY") -> list[float]:
    """
    Converts a piece of text into a vector that represents its
    meaning, using Google's Gemini embedding API. Similar-meaning
    texts produce vectors that are numerically close together.
    """
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type=task_type,
    )
    return result["embedding"]