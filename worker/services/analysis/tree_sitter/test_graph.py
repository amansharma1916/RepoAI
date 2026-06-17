from repository_symbol_indexer import RepositorySymbolIndexer
from dependency_extractor import DependencyExtractor
from dependency_resolver import DependencyResolver
from reverse_dependency_graph import ReverseDependencyGraph


indexer = RepositorySymbolIndexer()

symbols = indexer.index_repository(
    "repositories/28"
)

dependencies = (
    DependencyExtractor()
    .extract(symbols)
)

resolved_dependencies = (
    DependencyResolver()
    .resolve(dependencies)
)

# for dependency in resolved_dependencies[:20]:
#     print(dependency)


reverse_graph = (
    ReverseDependencyGraph()
    .build(resolved_dependencies)
)

for target, users in list(
    reverse_graph.items()
)[:5]:

    print(target)

    for user in users:
        print("  <-", user)