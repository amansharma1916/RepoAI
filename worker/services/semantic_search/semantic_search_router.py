from fastapi import APIRouter, HTTPException

from services.analysis.symbol_repository import SymbolRepository
from services.retrieval.retrieval_service import RetrievalService

router = APIRouter()

symbol_repository = SymbolRepository()

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



@router.get(
    "/search-symbols/{repository_id}"
)
def search_symbols(
    repository_id: int,
    q: str
):

    results = (
        symbol_repository
        .search_symbols(
            repository_id,
            q
        )
    )

    return {
        "query": q,
        "count": len(results),
        "results": [
            {
                "name": row[0],
                "symbol_type": row[1],
                "file_path": row[2],
                "language": row[3]
            }
            for row in results
        ]
    }

