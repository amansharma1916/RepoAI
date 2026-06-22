class DependencyGraph:

    def build(
        self,
        dependencies
    ):

        graph = {}

        for dependency in dependencies:

            source = dependency.source_file

            if source not in graph:
                graph[source] = []

            graph[source].append(
                {
                    "target": dependency.target,
                    "is_internal": dependency.is_internal
                }
            )

        return graph