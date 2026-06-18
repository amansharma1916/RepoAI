from fastapi import APIRouter
from pydantic import BaseModel
from .repoClone.git_service import clone_repository
from .repoStats.scanner import scan_repository
from .repoStats.file_repository import save_repository_files
from .repoStats.stats import generate_stats
from .repoStats.stats_repository import save_repository_stats
from .repoStats.framework_detector import detect_frameworks
from .repoStats.technology_repository import save_technologies

router = APIRouter()

class RepositoryRequest(BaseModel):
    repositoryId: int
    githubUrl: str

@router.post("/clone")
def clone_repository_endpoint(data: RepositoryRequest):

    path = clone_repository(
        data.githubUrl,
        data.repositoryId
    )

    files = scan_repository(path)

    frameworks = detect_frameworks(path)
    

    save_repository_files(
        data.repositoryId,
        files
    )

    stats = generate_stats(
        files
    )

    save_repository_stats(
        data.repositoryId,
        stats
    )

    save_technologies(
        data.repositoryId,
        frameworks
    )

    return {
        "success": True,
        "path": path,
        "total_files": len(files),
        "stats": stats,
        "frameworks": frameworks
    }
    