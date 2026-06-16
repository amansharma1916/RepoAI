from pathlib import Path

from parser_service import ParserService
from language_registry import get_language
from constants import IGNORE_DIRS

from models import (
    RepositoryParseResult,
    FailedParseResult,
)

class RepositoryParser:
    def __init__(self):
        self.parser = ParserService()

    def parse_repository(self, repo_path: str):
        total_files = 0
        supported_files = 0
        parsed_files = []
        failed_files = []

        for file in Path(repo_path).rglob("*"):

            parts = set(file.parts)

            if parts.intersection(IGNORE_DIRS):
                continue

            if not file.is_file():
                continue

            total_files += 1

            if not get_language(str(file)):
                continue

            supported_files += 1

            try:
                result = self.parser.parse_file(str(file))

                parsed_files.append(result)

            except Exception as e:

                failed_files.append(
                    FailedParseResult(
                        file_path=str(file),
                        error=str(e)
                    )
                )

        return RepositoryParseResult(
            total_files=total_files,
            supported_files=supported_files,
            parsed_files=parsed_files,
            failed_files=failed_files,
        )