from fastapi import APIRouter, HTTPException
from services.analysis.graph_service import GraphService
from services.analysis.tree_sitter.analysis_service import AnalysisService
from services.analysis.dependency_repository import DependencyRepository
from services.analysis.symbol_repository import SymbolRepository

router = APIRouter()

analysis_service = AnalysisService()
symbol_repository = SymbolRepository()
dependency_repository = DependencyRepository()
graph_service = GraphService()


@router.post(
    "/analyze/{repository_id}"
)
def analyze_repository(
    repository_id: int
):

    repo_path = (
        f"repositories/{repository_id}"
    )

    

    result = (
        analysis_service
        .analyze_repository(
            repository_id,
            repo_path
            )
    )

    return {
        "success": True,
        "repository_id": repository_id,
        "symbols": len(
            result["symbols"]
        ),
        "dependencies": len(
            result["dependencies"]
        ),
        "graph_nodes": len(
            result["dependency_graph"]
        ),
        "reverse_graph_nodes": len(
            result["reverse_dependency_graph"]
        )
    }

    # except Exception as e:

    #     raise HTTPException(
    #         status_code=500,
    #         detail=str(e)
    #     )
    

    
@router.get("/symbols/{repository_id}")
def get_symbols(
    repository_id: int
):

    symbols = symbol_repository.get_symbols(
        repository_id
    )

    return {
        "count": len(symbols),
        "symbols": symbols
    }
    

@router.get("/dependencies/{repository_id}")
def get_dependencies(
    repository_id: int
):

    dependencies = (
        dependency_repository
        .get_dependencies(
            repository_id
        )
    )

    return {
        "count": len(dependencies),
        "dependencies": dependencies
    }



@router.get(
    "/graph/{repository_id}"
)
def get_graph(
    repository_id: int
):

    dependencies = (
        dependency_repository
        .get_dependencies(repository_id)
    )

    graph = {}

    for dependency in dependencies:

        source_file = dependency[2]
        target =(
            dependency[4]
            if dependency[4]
            else dependency[3]
        )

        if source_file not in graph:
            graph[source_file] = []

        graph[source_file].append(target)

    return {
        "count": len(graph),
        "graph": graph
    }


@router.get(
    "/reverse-graph/{repository_id}"
)
def get_reverse_graph(
    repository_id: int
):

    dependencies = (
        dependency_repository
        .get_dependencies(repository_id)
    )

    graph = (
        graph_service
        .build_reverse_graph(
            dependencies
        )
    )

    return {
        "count": len(graph),
        "graph": graph
    }





@router.get("/health")
def health():

    return {
        "message": "Analysis service running"
    }