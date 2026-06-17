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

@dataclass
class Dependency:
    source_file: str
    target: str
    dependency_type: str
    is_internal: bool

@dataclass
class ResolvedDependency:
    source_file: str
    target: str
    resolved_path: str | None
    dependency_type: str
    is_internal: bool