from .repository_parser import RepositoryParser
from .symbol_extractor import SymbolExtractor

class RepositorySymbolIndexer:

    def __init__(self):
        self.repository_parser = RepositoryParser()
        self.symbol_extractor = SymbolExtractor()

    def index_repository(
        self,
        repo_path: str
    ):

        parse_result = self.repository_parser.parse_repository(
            repo_path
        )

        symbols = []

        for file_result in parse_result.parsed_files:

            file_symbols = self.symbol_extractor.extract(
                file_result
            )

            symbols.extend(file_symbols)

        return symbols