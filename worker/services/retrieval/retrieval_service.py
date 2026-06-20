    


from services.embedding.embedding_repository import EmbeddingRepository
from services.embedding.embedding_service import EmbeddingService


class RetrievalService:

    def __init__(self):
        self.embedding_repository = (
            EmbeddingRepository()
        )

        self.embedding_service = (
            EmbeddingService()
        )

    def semantic_search(
        self,
        repository_id: int,
        query: str,
        limit: int = 5
    ):

        query_embedding = (
            self.embedding_service
            .generate_embedding(query)
        )

        results = (
            self.embedding_repository
            .semantic_search(
                repository_id,
                query_embedding,
                limit
            )
        )

        return [
            {
                "chunk_id": row[0],
                "chunk_type": row[1],
                "chunk_name": row[2],
                "file_path": row[3],
                "content": row[4],
                "score": float(row[5])
            }
            for row in results
        ]