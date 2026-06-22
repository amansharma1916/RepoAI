from pathlib import Path

from services.utils.path_utils import to_repo_path

from .models import ResolvedDependency


class DependencyResolver:

    def resolve(
        self,
        dependencies
    ):

        resolved_dependencies = []

        for dependency in dependencies:

            resolved_dependencies.append(
                self._resolve_dependency(
                    dependency
                )
            )

        return resolved_dependencies

    def _resolve_dependency(
        self,
        dependency
    ):

        resolved_path = None

        if dependency.is_internal:

            resolved_path = self._resolve_internal_path(
                dependency.source_file,
                dependency.target
            )

        
        # print("SOURCE:", to_repo_path(dependency.source_file))    
        # print("SOURCE:", dependency.source_file)
        # print("RESOLVED:", resolved_path)

        return ResolvedDependency(
            # source_file=to_repo_path(dependency.source_file),
            source_file=dependency.source_file,
            target=dependency.target,
            # resolved_path=to_repo_path(resolved_path) if resolved_path else None,
            resolved_path=resolved_path,
            dependency_type=dependency.dependency_type,
            is_internal=dependency.is_internal
        )

    def _resolve_internal_path(
        self,
        source_file: str,
        target: str
    ):

        try:

            source_dir = Path(
                source_file
            ).parent

            candidate = (
                source_dir / target
            ).resolve()

            if candidate.exists():
                return str(candidate)

            extensions = [
                ".js",
                ".jsx",
                ".ts",
                ".tsx",
                ".py",
                ".css",
            ]

            for extension in extensions:

                file_candidate = Path(
                    str(candidate) + extension
                )

                if file_candidate.exists():
                    return str(
                        file_candidate.resolve()
                    )

            if candidate.is_dir():

                for index_file in [
                    "index.js",
                    "index.jsx",
                    "index.ts",
                    "index.tsx",
                    "__init__.py",
                ]:

                    index_candidate = (
                        candidate / index_file
                    )

                    if index_candidate.exists():
                        return str(
                            index_candidate.resolve()
                        )

            return None

        except Exception:
            return None