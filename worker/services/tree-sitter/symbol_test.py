from parser_service import ParserService
from symbol_extractor import SymbolExtractor

parser = ParserService()
extractor = SymbolExtractor()

result = parser.parse_file(
    "services/tree-sitter/sample.py"
)

symbols = extractor.extract(result)

for symbol in symbols:
    print(symbol)