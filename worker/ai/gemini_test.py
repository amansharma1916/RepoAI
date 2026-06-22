# from google import genai
# import os
# from dotenv import load_dotenv

# load_dotenv()

# client = genai.Client(
#     api_key=os.getenv("GEMINI_API_KEY")
# )

# response = client.models.generate_content(
#     model="gemini-2.5-flash",
#     contents="Say hello"
# )

# print(response.text)




# from ai.llm.llm_service import LLMService


# service = LLMService()

# response = service.generate(
#     "What is React in one line ?"
# )

# print(response)


    


from ai.chat.ask_service import AskService


service = AskService()

answer = service.ask(
    repository_id=2,
    question="where is student page ?"
)

print(answer)