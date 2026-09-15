import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

GENERATION_MODEL = "gemini-3.6-flash"


async def generate_script(user_request: str, retrieved_assets: list[dict]) -> str:
    context = "\n\n".join(
        f"Past script ({a['sector']}): {a['text']}" for a in retrieved_assets
    )

    prompt = f"""You are writing a video script.

USER REQUEST:
{user_request}

RELEVANT PAST SCRIPTS (for style/tone reference):
{context}

Write a new short video script (60 seconds) for this request."""

    model = genai.GenerativeModel(GENERATION_MODEL)
    response = await model.generate_content_async(prompt)
    return response.text