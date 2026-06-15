
from fastapi import APIRouter
from pydantic import BaseModel
from .git_service import clone_repository

router = APIRouter()

class RepositoryRequest(BaseModel):
    repositoryId: int
    githubUrl: str

@router.post("/clone")
def clone_repository_endpoint(data: RepositoryRequest):

    path = clone_repository(
        data.githubUrl,
        data.repositoryId
    )

    return {
        "success": True,
        "path": path
    }
    