from .repository_symbol_indexer import RepositorySymbolIndexer
from .dependency_extractor import DependencyExtractor
from .dependency_resolver import DependencyResolver
from .dependency_graph import DependencyGraph
from .reverse_dependency_graph import ReverseDependencyGraph
from services.analysis.symbol_repository import SymbolRepository
from services.analysis.dependency_repository import DependencyRepository
from services.analysis.chunk_repository import ChunkRepository
from services.analysis.chunk.chunk_extractor import RepositoryChunkGenerator

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

        self.symbol_repository = (
            SymbolRepository()
        )
        self.dependency_repository = (
            DependencyRepository()
        )
        self.chunk_repository = (
            ChunkRepository()
        )
        self.chunk_generator = (
            RepositoryChunkGenerator()
        )


    def analyze_repository(
        self,
        repository_id: int,
        repo_path: str
    ):

        symbols = (
            self.symbol_indexer
            .index_repository(repo_path)
        )

        # print("Analysis service:", symbols[269].__dict__)

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

        # print("Symbols:", len(symbols))
        # print("Symbols:", symbols[:10])
        # print("Dependencies:", len(resolved_dependencies))

        self.symbol_repository.save_symbols(
            repository_id,
            symbols
        )

        self.dependency_repository.save_dependencies(
            repository_id,
            resolved_dependencies
        )

        chunks = (
            self.chunk_generator.generate(
                repository_id,
                repo_path,
                symbols
            )
        )

        print("Chunks:", len(chunks))
        print(chunks[0])
        print(chunks[0]["content"][:300])

        # print("\nChunks:", len(chunks))

        self.chunk_repository.save_chunks(
            repository_id,
            chunks
        )

        return {
            "symbols": symbols,
            "dependencies": dependencies,
            "resolved_dependencies": resolved_dependencies,
            "dependency_graph": graph,
            "reverse_dependency_graph": reverse_graph,
            "chunks": {
                "count": len(chunks),
                "chunk_sample": chunks[0] if chunks else None
            }
        }