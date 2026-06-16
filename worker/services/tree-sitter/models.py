from dataclasses import dataclass
from typing import Any


@dataclass
class ParseResult:
    file_path: str
    language: str
    root_node: Any


@dataclass
class FailedParseResult:
    file_path: str
    error: str


@dataclass
class RepositoryParseResult:
    total_files: int
    supported_files: int
    parsed_files: list[ParseResult]
    failed_files: list[FailedParseResult]

@dataclass
class Symbol:
    name: str
    symbol_type: str
    file_path: str
    language: str