

from services.analysis.dependency_repository import DependencyRepository


class TraceService:

    def __init__(self):
        self.dependency_repository = DependencyRepository()

    def trace_file(
        self,
        repository_id: int,
        file_path: str
    ):

        dependencies = (
            self.dependency_repository
            .get_file_dependencies(
                repository_id,
                file_path
            )
        )

        dependents = (
            self.dependency_repository
            .get_file_dependents(
                repository_id,
                file_path
            )
        )

        return {
            "file": file_path,
            "dependencies": [
                row[0]
                for row in dependencies
            ],
            "dependents": [
                row[0]
                for row in dependents
            ]
        }

    def trace_tree(
        self,
        repository_id: int,
        file_path: str,
        depth: int = 3
    ):

        return self._build_tree(
            repository_id,
            file_path,
            depth,
            set()
        )

    def _build_tree(
        self,
        repository_id: int,
        file_path: str,
        depth: int,
        visited: set
    ):

        if file_path in visited:
            return {
                "file": file_path,
                "circular": True
            }

        visited.add(file_path)

        if depth <= 0:
            return {
                "file": file_path,
                "dependencies": []
            }

        dependencies = (
            self.dependency_repository
            .get_file_dependencies(
                repository_id,
                file_path
            )
        )

        node = {
            "file": file_path,
            "dependencies": []
        }

        for dependency in dependencies:

            child_file = dependency[0]

            child_node = self._build_tree(
                repository_id,
                child_file,
                depth - 1,
                visited.copy()
            )

            node["dependencies"].append(
                child_node
            )

        return node