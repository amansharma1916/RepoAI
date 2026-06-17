class GraphService:

    def build_reverse_graph(
        self,
        dependencies
    ):

        graph = {}

        for dependency in dependencies:

            source_file = dependency[2]

            target = (
                dependency[4]
                if dependency[4]
                else dependency[3]
            )

            if target not in graph:
                graph[target] = []

            graph[target].append(
                source_file
            )

        return graph