from pathlib import Path

LANGUAGE_MAP = {
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".py": "Python",
    ".java": "Java",
    ".go": "Go",
    ".php": "PHP",
    ".css": "CSS",
    ".html": "HTML",
}


def generate_stats(files):

    total_files = len(files)

    total_size = sum(
        file["size"]
        for file in files
    )

    folders = set()

    language_stats = {}

    for file in files:

        folder = str(
            Path(file["file_path"]).parent
        )

        if folder != ".":
            folders.add(folder)

        language = LANGUAGE_MAP.get(
            file["extension"]
        )

        if language:
            language_stats[language] = (
                language_stats.get(language, 0) + 1
            )

    return {
        "total_files": total_files,
        "total_folders": len(folders),
        "total_size": total_size,
        "languages": language_stats
    }