from .models import Symbol


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
            self._extract_js_function(
                node,
                source,
                parse_result,
                symbols
            )
            self._extract_mongoose_model(
                node,
                source,
                parse_result,
                symbols
            )

        if node.kind() == "call_expression":
            self._extract_express_route(
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



    def _extract_express_route(
        self,
        node,
        source,
        parse_result,
        symbols
    ):

        if node.child_count() == 0:
            return

        function_node = node.child(0)

        if function_node.kind() != "member_expression":
            return

        expression_text = source[
            function_node.start_byte():
            function_node.end_byte()
        ]

        if expression_text not in [
            "router.get",
            "router.post",
            "router.put",
            "router.patch",
            "router.delete",
            "app.get",
            "app.post",
            "app.put",
            "app.patch",
            "app.delete"
        ]:
            return
        
        method = expression_text.split(".")[1].upper()
        
        arguments_node = node.child_by_field_name(
            "arguments"
        )

        if not arguments_node:
            return

        if arguments_node.child_count() < 2:
            return
        

        route_node = arguments_node.child(1)

        route_path = source[
            route_node.start_byte():
            route_node.end_byte()
        ]

        route_path = route_path.strip("'\"")


        symbols.append(
            Symbol(
                name=f"{method} {route_path}",
                symbol_type="route",
                file_path=parse_result.file_path,
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
            )
        )

        # print(
        #     source[
        #         arguments_node.start_byte():
        #         arguments_node.end_byte()
        #     ]
        # )


    def _extract_mongoose_model(
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

        if value_node.kind() != "call_expression":
            return

        expression = source[
            value_node.start_byte():
            value_node.end_byte()
        ]

        if "mongoose.model" not in expression:
            return

        name = source[
            identifier_node.start_byte():
            identifier_node.end_byte()
        ]

        symbols.append(
            Symbol(
                name=name,
                symbol_type="model",
                file_path=parse_result.file_path,
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
            )
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
                  language=parse_result.language,
                  start_line=node.start_position().row + 1,
                  end_line=node.end_position().row + 1
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
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
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
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
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
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
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
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
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
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
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
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
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
        # print("DIRRRRR")
        # print(node.start_position().row)
        # print(type(node.start_position()))

        # print(node.end_position().row)
        # print(type(node.end_position()))
        # print(type(node))
        # print(dir(node))

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
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
            )
        )

    def _extract_js_function(
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

        if value_node.kind() not in [
            "arrow_function",
            "async_arrow_function",
            "function_expression",
            
            
        ]:
            return

        name = source[
            identifier_node.start_byte():
            identifier_node.end_byte()
        ]

        if not name:
            return

        if name[0].isupper():
            return

        symbols.append(
            Symbol(
                name=name,
                symbol_type="function",
                file_path=parse_result.file_path,
                language=parse_result.language,
                start_line=node.start_position().row + 1,
                end_line=node.end_position().row + 1
            )
        )




