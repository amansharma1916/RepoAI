from dataclasses import dataclass
from datetime import datetime


@dataclass
class RepositoryEmbedding:
    id: int | None = None
    repository_id: int | None = None
    chunk_id: int | None = None
    model_name: str | None = None
    embedding: list[float] | None = None
    created_at: datetime | None = None