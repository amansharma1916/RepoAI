# from .dependency_repository import (
#     DependencyRepository
# )

# repo = DependencyRepository()

# dependencies = repo.get_dependencies(28)

# print(len(dependencies))

# for dependency in dependencies[:5]:
#     print(dependency)

# from services.analysis.tree_sitter.analysis_service import AnalysisService
# analysis_service = AnalysisService()

# result = (
#             analysis_service
#             .analyze_repository(
#                 27,
#                 "repositories/27"
#             )
#         )

# print("done analyzing")



# return {
#     "success": True,
#     "repository_id": 27,
#     "symbols": len(
#     result["symbols"]
#     ),
#     "dependencies": len(
#     result["dependencies"]
#     ),
#     "graph_nodes": len(
#     result["dependency_graph"]
#     ),
#     "reverse_graph_nodes": len(
#     result["reverse_graph"]
#     )
# }






from services.analysis.symbol_repository import SymbolRepository


repo = SymbolRepository()

results = repo.search_symbols(
    24,
    "navbar"
)

print(len(results))

for result in results:
    print(result)


