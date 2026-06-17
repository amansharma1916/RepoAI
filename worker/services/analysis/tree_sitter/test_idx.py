from repository_symbol_indexer import RepositorySymbolIndexer
from dependency_extractor import DependencyExtractor
indexer = RepositorySymbolIndexer()

symbols = indexer.index_repository(".")

extractor = DependencyExtractor()

dependencies = extractor.extract(symbols)



# print(len(symbols))

# for symbol in symbols[:20]:
#     print(symbol)

print(len(dependencies))

for dependency in dependencies:
    if not dependency.is_internal:
        print(dependency)