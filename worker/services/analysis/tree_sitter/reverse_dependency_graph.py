class ReverseDependencyGraph:

    def build(
        self,
        resolved_dependencies
    ):

        graph = {}

        for dependency in resolved_dependencies:

            if not dependency.resolved_path:
                continue

            target = dependency.resolved_path

            if target not in graph:
                graph[target] = []

            graph[target].append(
                dependency.source_file
            )

        return graph