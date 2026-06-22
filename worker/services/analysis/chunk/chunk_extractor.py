from pathlib import Path


class ChunkExtractor:

    def extract_symbol_chunk(
        self,
        symbol,
        repository_path: str
    ):
        file_path = Path(symbol.file_path)

        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        content = "".join(
            lines[
                symbol.start_line - 1:
                symbol.end_line
            ]
        )

        return {
            "symbol_id": None,
            "chunk_type": symbol.symbol_type,
            "chunk_name": symbol.name,
            "file_path": symbol.file_path,
            "content": content,
            "start_line": symbol.start_line,
            "end_line": symbol.end_line,
        }
    

class RepositoryChunkGenerator:

    def __init__(self):
        self.chunk_extractor = ChunkExtractor()

    def generate(
        self,
        repository_id: int,
        repository_path: str,
        symbols: list
    ):
        chunks = []

        for symbol in symbols:

            if symbol.symbol_type == 'import':
                continue

            chunk = self.chunk_extractor.extract_symbol_chunk(
                symbol,
                repository_path
            )

            chunks.append(chunk)

        return chunks