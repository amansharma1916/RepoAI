from fastapi import APIRouter
from services.analysis.tree_sitter.analysis_service import AnalysisService

router = APIRouter()

analysis_service = AnalysisService()

@router.get("/tree-sitter")
def analyze_repository():

    result = analysis_service.analyze_repository(
        "repositories/28"
    )

    return {
        "total_symbols": len(
            result["symbols"]
        ),
        "total_dependencies": len(
            result["dependencies"]
        ),
        "total_files": len(
            result["dependency_graph"]
        )
    }

@router.get("/symbols")
def get_symbols():

    result = analysis_service.analyze_repository(
        "repositories/28"
    )

    return [{
        "count": len(result["symbols"]),
        "symbols": [
            {
                "name": symbol.name,
                "type": symbol.symbol_type,
                "file": symbol.file_path
            }
            for symbol in result["symbols"]
        ]
    }]
    
@router.get("/graph")
def get_graph():

    result = analysis_service.analyze_repository(
        "repositories/28"
    )

    return [
        {
            "count": len(result["dependency_graph"]),
            "graph": result["dependency_graph"]
        }
    ]


@router.get("/health")
def health():

    return {
        "message": "Analysis service running"
    }