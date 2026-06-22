from pydantic import BaseModel
from fastapi import APIRouter
from ai.chat.ask_service import AskService

router = APIRouter()

class AskRequest(BaseModel):
    question: str


@router.post(
    "/ask/{repository_id}"
)
def ask_repository(
    repository_id: int,
    request: AskRequest
):

    service = AskService()

    return service.ask(
        repository_id,
        request.question
    )