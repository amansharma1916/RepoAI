from git import Repo
import os
import shutil

def clone_repository(github_url, repo_id):
    repo_path = f"./repositories/{repo_id}"

    # Idempotent: a previous partial/failed run may have left the directory
    # behind. Remove it so retries and re-analysis start from a clean clone
    # instead of crashing with "destination path already exists".
    if os.path.exists(repo_path):
        shutil.rmtree(repo_path)

    Repo.clone_from(
        github_url,
        repo_path
    )

    return repo_path