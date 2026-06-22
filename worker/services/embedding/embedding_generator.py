
from services.analysis.chunk_repository import ChunkRepository
from services.embedding.embedding_repository import EmbeddingRepository
from services.embedding.embedding_service import EmbeddingService


class EmbeddingGenerator:

    def __init__(self):
        self.chunk_repository = ChunkRepository()
        self.embedding_repository = EmbeddingRepository()
        self.embedding_service = EmbeddingService()

    def generate_repository_embeddings(
        self,
        repository_id: int
    ):

        chunks = self.chunk_repository.get_chunks(
            repository_id
        )

        embeddings = []

        for chunk in chunks:

            chunk_id = chunk[0]
            content = chunk[6]

            vector = (
                self.embedding_service
                .generate_embedding(content)
            )

            embeddings.append(
                {
                    "chunk_id": chunk_id,
                    "model_name": "BAAI/bge-base-en-v1.5",
                    "embedding": vector
                }
            )

        self.embedding_repository.save_embeddings(
            repository_id,
            embeddings
        )

        return len(embeddings)