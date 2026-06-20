from dataclasses import dataclass
from typing import Optional


@dataclass
class Chunk:
    repository_id: int
    symbol_id: Optional[int]

    chunk_type: str
    chunk_name: str

    file_path: str

    content: str

    start_line: int
    end_line: int

    metadata: dict