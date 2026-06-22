import os

from dotenv import load_dotenv
from google import genai


load_dotenv()


class LLMService:

    def __init__(self):

        self.client = genai.Client(
            api_key=os.getenv(
                "GEMINI_API_KEY"
            )
        )

    def generate(
        self,
        prompt: str
    ) -> str:

        response = (
            self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
        )

        return response.text