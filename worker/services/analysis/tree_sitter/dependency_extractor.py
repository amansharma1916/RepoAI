from .models import Dependency


class DependencyExtractor:

    def extract(self, symbols):

        dependencies = []

        for symbol in symbols:

            if symbol.symbol_type != "import":
                continue
            
            normalized_target = self._normalize_import(symbol.name)

            dependencies.append(
                Dependency(
                    source_file=symbol.file_path,
                    target=normalized_target,
                    dependency_type="import",
                    is_internal=self._is_internal(
                        normalized_target
                    )
                )
            )

        return dependencies

    def _normalize_import(
        self,
        statement: str
    ):

        statement = statement.strip()

        if statement.startswith("from "):

            module = (
                statement
                .replace("from ", "", 1)
                .split(" import ")[0]
                .strip()
            )

            return module

        if statement.startswith("import "):

            import_part = (
                statement
                .replace("import ", "", 1)
                .replace(";", "")
                .strip()
            )

            if " from " in import_part:

                return (
                    import_part
                    .split(" from ")[1]
                    .strip()
                    .strip('"')
                    .strip("'")
                )

            return (
                import_part
                .strip()
                .strip('"')
                .strip("'")
            )

        return statement


    def _is_internal(
        self,
        target: str
    ):

        return (
            target.startswith("./")
            or target.startswith("../")
            or target.startswith("/")
            or target.startswith("services.")
        )   



