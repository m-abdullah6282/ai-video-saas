import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

for model in genai.list_models():
    if "embedContent" in model.supported_generation_methods:
        print(model.name)