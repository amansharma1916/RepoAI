

from services.analysis.dependency_repository import DependencyRepository
from services.analysis.symbol_repository import SymbolRepository
from services.initializeRepo.repoStats.file_repository import (get_repository_files)

class ArchitectureService:

    ENTRY_FILES = {
        "main.tsx",
        "main.jsx",
        "main.js",
        "App.tsx",
        "App.jsx",
        "App.js",
        "index.ts",
        "index.js",
        "server.ts",
        "server.js",
    }

    def __init__(self):

        self.symbol_repository = SymbolRepository()
        self.dependency_repository = DependencyRepository()

    def get_architecture(
        self,
        repository_id: int
    ):

        files = get_repository_files(repository_id)

        symbols = self.symbol_repository.get_symbols(
            repository_id
        )

        controllers = self._get_controllers(files)

        contexts = self._get_contexts(files)

        services = self._get_services(files)

        dependency_count = (
            self.dependency_repository
            .get_dependency_count(
                repository_id
            )
        )

        entry_points = self._get_entry_points(
            files
        )

        frontend_components = (
            self._get_frontend_components(
                symbols
            )
        )

        backend_routes = (
            self._get_backend_routes(
                files
            )
        )

        models = self._get_models(
            files
        )

        providers = self._get_providers(
            files
        )

        return {
            "repository_id": repository_id,

            "statistics": {
                "files": len(files),
                "symbols": len(symbols),
                "dependencies": dependency_count,
                "total_entry_points": len(entry_points),
                "backend_routes": len(backend_routes),
                "backend_models": len(models),
                "backend_controllers": len(controllers),
                "frontend_components": len(frontend_components),
                "frontend_contexts": len(contexts),
                "frontend_services": len(services),
                "frontend_providers": len(providers),
            },

            "entry_points": entry_points,

            "frontend": {
                "components_count": len(frontend_components),
                "components": frontend_components,
                "contexts": contexts,
                "services": services,
                "providers": providers
            },

            "backend": {
                "models": models,
                "routes": backend_routes,
                "controllers": controllers
            }
        }
    


    def _get_entry_points(
        self,
        files
    ):

        entry_points = []

        for file in files:

            file_name = file[0]

            if file_name in self.ENTRY_FILES:

                entry_points.append(
                    file[1]
                )

        return sorted(
            list(set(entry_points))
        )

    def _get_frontend_components(
        self,
        symbols
    ):

        components = []

        for symbol in symbols:

            symbol_type = symbol[3]

            if symbol_type != "component":
                continue

            components.append(
                {
                    "name": symbol[2],
                    "file_path": symbol[4]
                }
            )

        return components[:50]

    def _get_providers(
        self,
        files
    ):
        providers = []

        for file in files:

            file_name = file[0].lower()

            if "provider" in file_name:
                providers.append(file[1])

        return sorted(list(set(providers)))

    def _get_backend_routes(
        self,
        files
    ):
        routes = []

        for file in files:

            file_path = file[1].lower()
            file_name = file[0].lower()

            if (
                "/routes/" in file_path
                or "\\routes\\" in file_path
            ):
                routes.append(file[1])

        return sorted(list(set(routes)))


    def _get_controllers(
        self,
        files
    ):
        controllers = []

        for file in files:

            file_name = file[0].lower()

            if "controller" in file_name:
                controllers.append(file[1])

        return sorted(list(set(controllers)))



    def _get_contexts(
        self,
        files
    ):
        contexts = []

        for file in files:

            file_name = file[0].lower()

            if "context" in file_name:
                contexts.append(file[1])

        return sorted(list(set(contexts)))

    def _get_models(
        self,
        files
    ):
        models = []

        for file in files:

            file_name = file[0].lower()

            if "schema" in file_name:
                models.append(file[1])

        return sorted(list(set(models)))


    def _get_services(
        self,
        files
    ):
        services = []

        for file in files:

            file_path = file[1]

            if "/services/" in file_path:
                services.append(file_path)

        return sorted(list(set(services)))