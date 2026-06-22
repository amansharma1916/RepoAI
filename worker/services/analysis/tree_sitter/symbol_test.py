
from services.analysis.tree_sitter.parser_service import ParserService
from services.analysis.tree_sitter.symbol_extractor import SymbolExtractor


parser = ParserService()
extractor = SymbolExtractor()

result = parser.parse_file(
    "services/analysis/tree_sitter/test.js"
)

symbols = extractor.extract(result)

for symbol in symbols:
    print(symbol)
    print("================================")

print(len(symbols))
