from pathlib import Path

SUPPORTED_LANGUAGES = {
    ".js": "javascript",
    ".jsx": "javascript",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".py": "python",
}


def get_language(file_path: str) -> str | None:
    return SUPPORTED_LANGUAGES.get(
        Path(file_path).suffix.lower()
    )

