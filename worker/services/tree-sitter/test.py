from repository_parser import RepositoryParser
from parser_service import ParserService

parser = RepositoryParser()
file_parser = ParserService()

# result = parser.parse_repository("services/initializeRepo")

# result = file_parser.parse_file("services/tree-sitter/sample.py")

# def inspect_function(node):
#     print("WHat")

#     source = open(
#     "services/tree-sitter/sample.py",
#     "r",
#     encoding="utf-8"
#     ).read()

#     identifier_node = node.child(1)

#     print("Kind:", identifier_node.kind())

    

#     name = source[
#         identifier_node.start_byte():
#         identifier_node.end_byte()
#     ]

#     print(name)


# def find_functions(node):
#     if node.kind() == "function_definition":
#         inspect_function(node)
    

#     for i in range(node.child_count()):
#         child = node.child(i)

#         if child:
#             find_functions(child)


# def inspect_class(node):

#     print("\nCLASS NODE")

#     source = open(
#     "services/tree-sitter/sample.py",
#     "r",
#     encoding="utf-8"
#     ).read()

#     identifier_node = node.child(1)

#     name = source[
#         identifier_node.start_byte():
#         identifier_node.end_byte()
#     ]

#     print("Class Name:", name)


# def find_classes(node):

#     # if "class" in node.kind():
#     #     print(node.kind())

#     if node.kind() == "class_definition":
#         inspect_class(node)

#     for i in range(node.child_count()):
#         child = node.child(i)

#         if child:
#             find_classes(child)


# find_functions(result.root_node)

# find_classes(result.root_node)


# print(result)
# print(file_result.file_path)
# print(file_result.language)
# print(file_result.root_node.kind())

# print("Total :" , result.total_files)
# print("Supported :" , result.supported_files)

# print("Parsed :" , len(result.parsed_files))
# print("Failed :" , len(result.failed_files))

# first = result.parsed_files[1]

# print(first.file_path)
# print(first.language)
# print(first.root_node.kind())



result = file_parser.parse_file("services/tree-sitter/sample.jsx")

def print_ast(node, depth=0):

    print(
        "  " * depth +
        node.kind()
    )

    for i in range(node.child_count()):
        child = node.child(i)

        if child:
            print_ast(
                child,
                depth + 1
            )

# with open("output.txt", "w", encoding="utf-8") as f:
#     def print_ast_to_file(node, depth=0):
#         f.write(
#             "  " * depth +
#             node.kind() + "\n"
#         )

#         for i in range(node.child_count()):
#             child = node.child(i)

#             if child:
#                 print_ast_to_file(
#                     child,
#                     depth + 1
#                 )

#     print_ast_to_file(result.root_node)


# print_ast(result.root_node)

