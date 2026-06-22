from git import Repo
import os

def clone_repository(github_url, repo_id):
    repo_path = f"./repositories/{repo_id}"

    Repo.clone_from(
        github_url,
        repo_path
    )

    return repo_path