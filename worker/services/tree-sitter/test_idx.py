from repository_symbol_indexer import RepositorySymbolIndexer

indexer = RepositorySymbolIndexer()

symbols = indexer.index_repository(".")

print(len(symbols))

for symbol in symbols[:20]:
    print(symbol)