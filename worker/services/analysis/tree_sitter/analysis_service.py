from .repository_symbol_indexer import RepositorySymbolIndexer
from .dependency_extractor import DependencyExtractor
from .dependency_resolver import DependencyResolver
from .dependency_graph import DependencyGraph
from .reverse_dependency_graph import ReverseDependencyGraph


class AnalysisService:

    def __init__(self):

        self.symbol_indexer = (
            RepositorySymbolIndexer()
        )

        self.dependency_extractor = (
            DependencyExtractor()
        )

        self.dependency_resolver = (
            DependencyResolver()
        )

        self.dependency_graph = (
            DependencyGraph()
        )

        self.reverse_dependency_graph = (
            ReverseDependencyGraph()
        )

    def analyze_repository(
        self,
        repo_path: str
    ):

        symbols = (
            self.symbol_indexer
            .index_repository(repo_path)
        )

        dependencies = (
            self.dependency_extractor
            .extract(symbols)
        )

        resolved_dependencies = (
            self.dependency_resolver
            .resolve(dependencies)
        )

        graph = (
            self.dependency_graph
            .build(resolved_dependencies)
        )

        reverse_graph = (
            self.reverse_dependency_graph
            .build(resolved_dependencies)
        )

        return {
            "symbols": symbols,
            "dependencies": dependencies,
            "resolved_dependencies": resolved_dependencies,
            "dependency_graph": graph,
            "reverse_dependency_graph": reverse_graph
        }