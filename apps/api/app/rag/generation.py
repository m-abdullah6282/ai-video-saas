import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

GENERATION_MODEL = "gemini-3.6-flash"

async def generate_script(user_request: str, retrieved_assets: list[dict]) -> str:
    """
    RAG's 'Generation' step: takes the user's request + retrieved
    similar past scripts, and asks the LLM to write a new script
    informed by them.
    """
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
    response = model.generate_content(prompt)
    return response.text