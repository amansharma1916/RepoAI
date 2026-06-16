from models import Symbol


class SymbolExtractor:

    def extract(self, parse_result):

        symbols = []

        with open(
            parse_result.file_path,
            "r",
            encoding="utf-8",
            errors="ignore"
        ) as f:
            source = f.read()

        self._walk(
            parse_result.root_node,
            source,
            parse_result,
            symbols
        )

        return symbols
    
    

    def _walk(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        if node.kind() == "function_definition":
            self.inspect_parent(node)
            self._extract_function(
                node,
               source,
                parse_result,
                symbols
            )

        if node.kind() == "class_definition":
            self.inspect_parent(node)
            self._extract_class(
                node,
                source,
                parse_result,
                symbols
            )

        if node.kind() == "import_statement":
            self._extract_import(
                node,
                source,
                parse_result,
                symbols
            )

        if node.kind() == "import_from_statement":
            self._extract_from_import(
                node,
                source,
                parse_result,
                symbols
            )

        if node.kind() == "function_declaration":
            self._extract_ts_function(
                node,
                source,
                parse_result,
                symbols
            )

        if node.kind() == "class_declaration":
            self._extract_ts_class(
                node,
                source,
                parse_result,
                symbols
            )

        if node.kind() == "method_definition":
            self._extract_ts_method(
                node,
                source,
                parse_result,
                symbols
            )

        if node.kind() == "variable_declarator":
            self._extract_jsx_component(
                node,
                source,
                parse_result,
                symbols
            )

        for i in range(node.child_count()):

            child = node.child(i)

            if child:
                self._walk(
                    child,
                    source,
                    parse_result,
                    symbols
                )


    def _is_method(self, node):

        current = node.parent()

        while current:

            if current.kind() == "class_definition":
                return True

            current = current.parent()

        return False

    def inspect_parent(self, node):

        current = node

        while current:

            # print(current.kind())

            current = current.parent()

    def _extract_class(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        identifier_node = node.child(1)

        name = source[
            identifier_node.start_byte():
            identifier_node.end_byte()
        ]

        symbols.append(
            Symbol(
                 name=name,
                 symbol_type="class",
                  file_path=parse_result.file_path,
                  language=parse_result.language
                )
        )

    def _extract_function(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        identifier_node = node.child(1)

        name = source[
            identifier_node.start_byte():
            identifier_node.end_byte()
        ]

        symbol_type = (
            "method"
            if self._is_method(node)
            else "function"
        )

        symbols.append(
            Symbol(
                name=name,
                symbol_type=symbol_type,
                file_path=parse_result.file_path,
                language=parse_result.language
            )
        )

    def _extract_import(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        start = node.start_byte()
        end = node.end_byte()

        statement = source[start:end].strip()

        symbols.append(
            Symbol(
                name=statement,
                symbol_type="import",
                file_path=parse_result.file_path,
                language=parse_result.language
            )
        )

    def _extract_from_import(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        start = node.start_byte()
        end = node.end_byte()

        statement = source[start:end].strip()

        symbols.append(
            Symbol(
                name=statement,
                symbol_type="import",
                file_path=parse_result.file_path,
                language=parse_result.language
            )
        )

    def _extract_ts_function(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        identifier_node = node.child(1)

        name = source[
            identifier_node.start_byte():
            identifier_node.end_byte()
        ]

        symbols.append(
            Symbol(
                name=name,
                symbol_type="function",
                file_path=parse_result.file_path,
                language=parse_result.language
            )
        )

    def _extract_ts_class(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        identifier_node = node.child(1)

        name = source[
            identifier_node.start_byte():
            identifier_node.end_byte()
        ]

        symbols.append(
            Symbol(
                name=name,
                symbol_type="class",
                file_path=parse_result.file_path,
                language=parse_result.language
            )
        )

    def _extract_ts_method(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        identifier_node = node.child(0)

        name = source[
            identifier_node.start_byte():
            identifier_node.end_byte()
        ]

        symbols.append(
            Symbol(
                name=name,
                symbol_type="method",
                file_path=parse_result.file_path,
                language=parse_result.language
            )
        )

    def _extract_jsx_component(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        if node.child_count() < 3:
            return

        identifier_node = node.child(0)

        value_node = node.child(2)

        if value_node.kind() != "arrow_function":
            return

        name = source[
            identifier_node.start_byte():
            identifier_node.end_byte()
        ]

        if not name:
            return

        if not name[0].isupper():
            return

        symbols.append(
            Symbol(
                name=name,
                symbol_type="component",
                file_path=parse_result.file_path,
                language=parse_result.language
            )
        )
