from pathlib import Path

from tree_sitter_language_pack import get_parser

from language_registry import get_language

from models import ParseResult

class ParserService:
    def parse_source(
        self,
        source: str,
        language: str
    ):
        parser = get_parser(language)

        tree = parser.parse(source)

        return tree.root_node()

    def parse_file(
        self,
        file_path: str
    ):
        language = get_language(file_path)

        if not language:
            raise ValueError(
                f"Unsupported language: {Path(file_path).suffix}"
            )

        with open(
            file_path,
            "r",
            encoding="utf-8",
            errors="ignore"
        ) as f:
            source = f.read()

        root_node = self.parse_source(
                    source,
                    language
                )

        return ParseResult(
            file_path=file_path,
            language=language,
            root_node=root_node
)