from pathlib import Path

def to_repo_path(path):

    if not path:
        return None

    path = Path(str(path)).as_posix()

    if "/repositories/" in path:
        return path.split("/repositories/", 1)[1].split("/", 1)[1]

    if path.startswith("repositories/"):
        return path.split("/", 2)[2]

    return path