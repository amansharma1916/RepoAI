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

        for i in range(node.child_count()):

            child = node.child(i)

            if child:
                self._walk(
                    child,
                    source,
                    parse_result,
                    symbols
                )



    def inspect_parent(self, node):

        current = node

        while current:

            print(current.kind())

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

        symbols.append(
            Symbol(
                name=name,
                symbol_type="function",
                file_path=parse_result.file_path,
                language=parse_result.language
            )
        )