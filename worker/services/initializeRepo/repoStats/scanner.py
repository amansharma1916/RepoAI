import os

from .constants import IGNORE_DIRS


def scan_repository(repo_path):
    files = []

    for root, dirs, filenames in os.walk(repo_path):

        dirs[:] = [
            d for d in dirs
            if d not in IGNORE_DIRS
        ]

        for filename in filenames:

            full_path = os.path.join(root, filename)

            relative_path = os.path.relpath(
                full_path,
                repo_path
            )

            files.append({
                "file_name": filename,
                "file_path": relative_path,
                "extension": os.path.splitext(filename)[1],
                "size": os.path.getsize(full_path)
            })

    return files