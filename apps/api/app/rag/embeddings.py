import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

EMBEDDING_MODEL = "models/text-embedding-004"


async def get_embedding(text: str) -> list[float]:
    """
    Converts a piece of text into a vector that represents its
    meaning, using Google's Gemini embedding API. Similar-meaning
    texts produce vectors that are numerically close together.
    """
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
    )
    return result["embedding"]