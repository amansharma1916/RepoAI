from fastapi import APIRouter, HTTPException

from services.retrieval.retrieval_service import RetrievalService

router = APIRouter()


@router.get(
    "/{repository_id}"
)
def semantic_search(
    repository_id: int,
    q: str,
    limit: int = 5
):
    retrieval_service = RetrievalService()

    results = retrieval_service.semantic_search(
        repository_id,
        q,
        limit
    )

    return {
        "repository_id": repository_id,
        "query": q,
        "count": len(results),
        "results": results
    }