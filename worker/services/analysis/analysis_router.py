from fastapi import APIRouter, HTTPException
from services.analysis.graph_service import GraphService
from services.analysis.tree_sitter.analysis_service import AnalysisService
from services.analysis.dependency_repository import DependencyRepository
from services.analysis.symbol_repository import SymbolRepository
from services.initializeRepo.repoStats.file_repository import get_repository_files
from services.initializeRepo.repoStats.file_repository import get_file_path
from pathlib import Path


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


@router.get(
    "/overview/{repository_id}"
)
def get_overview(
    repository_id: int
):

    symbol_summary = (
        symbol_repository
        .get_symbol_summary(
            repository_id
        )
    )

    dependency_count = (
        dependency_repository
        .get_dependency_count(
            repository_id
        )
    )

    summary = {}

    total_symbols = 0

    for symbol_type, count in symbol_summary:

        summary[
            f"{symbol_type}_count"
        ] = count

        total_symbols += count

    return {
        "repository_id": repository_id,
        "symbol_count": total_symbols,
        "dependency_count": dependency_count,
        **summary
    }


@router.get(
    "/components/{repository_id}"
)
def get_components(
    repository_id: int
):

    components = (
        symbol_repository
        .get_symbols_by_type(
            repository_id,
            "component"
        )
    )

    return {
        "count": len(components),
        "components": [
            {
                "name": component[0],
                "file_path": component[1],
                "language": component[2]
            }
            for component in components
        ]
    }


@router.get(
    "/classes/{repository_id}"
)
def get_classes(
    repository_id: int
):

    classes = (
        symbol_repository
        .get_symbols_by_type(
            repository_id,
            "class"
        )
    )

    return {
        "count": len(classes),
        "classes": [
            {
                "name": row[0],
                "file_path": row[1],
                "language": row[2]
            }
            for row in classes
        ]
    }


@router.get(
    "/functions/{repository_id}"
)
def get_functions(
    repository_id: int
):

    functions = (
        symbol_repository
        .get_symbols_by_type(
            repository_id,
            "function"
        )
    )

    return {
        "count": len(functions),
        "functions": [
            {
                "name": row[0],
                "file_path": row[1],
                "language": row[2]
            }
            for row in functions
        ]
    }


@router.get(
    "/methods/{repository_id}"
)
def get_methods(
    repository_id: int
):

    methods = (
        symbol_repository
        .get_symbols_by_type(
            repository_id,
            "method"
        )
    )

    return {
        "count": len(methods),
        "methods": [
            {
                "name": row[0],
                "file_path": row[1],
                "language": row[2]
            }
            for row in methods
        ]
    }


@router.get(
    "/imports/{repository_id}"
)
def get_imports(
    repository_id: int
):

    imports = (
        symbol_repository
        .get_symbols_by_type(
            repository_id,
            "import"
        )
    )

    return {
        "count": len(imports),
        "imports": [
            {
                "name": row[0],
                "file_path": row[1],
                "language": row[2]
            }
            for row in imports
        ]
    }


@router.get(
    "/search/{repository_id}"
)
def search_symbols(
    repository_id: int,
    q: str
):

    results = (
        symbol_repository
        .search_symbols(
            repository_id,
            q
        )
    )

    return {
        "query": q,
        "count": len(results),
        "results": [
            {
                "name": row[0],
                "symbol_type": row[1],
                "file_path": row[2],
                "language": row[3]
            }
            for row in results
        ]
    }



@router.get(
    "/files/{repository_id}"
)
def get_files(
    repository_id: int
):

    files = (
        get_repository_files(
            repository_id
        )
    )

    return {
        "count": len(files),
        "files": [
            {
                "file_name": row[0],
                "file_path": row[1],
                "extension": row[2],
                "size": row[3]
            }
            for row in files
        ]
    }



@router.get(
    "/file-content/{repository_id}"
)
def get_file_content(
    repository_id: int,
    path: str
):

    file_record = get_file_path(
        repository_id,
        path
    )

    if not file_record:

        return {
            "error": "File not found"
        }

    full_path = (
        Path(
            f"repositories/{repository_id}"
        )
        / path
    )

    if not full_path.exists():

        return {
            "error": "Physical file not found"
        }

    with open(
        full_path,
        "r",
        encoding="utf-8",
        errors="ignore"
    ) as f:

        content = f.read()

    return {
        "path": path,
        "content": content
    }











@router.get("/health")
def health():

    return {
        "message": "Analysis service running"
    }