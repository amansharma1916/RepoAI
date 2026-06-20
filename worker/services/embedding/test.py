# from services.embedding.embedding_service import EmbeddingService

# service = EmbeddingService()

# embedding = service.generate_embedding(
#     "Authentication middleware validates JWT tokens"
# )

# print(type(embedding))
# print(len(embedding))


# 2nd 


# from services.embedding.embedding_repository import EmbeddingRepository

# repo = EmbeddingRepository()

# print("loaded")



# 3rd



# from services.embedding.embedding_generator import (
#     EmbeddingGenerator
# )

# generator = EmbeddingGenerator()

# count = generator.generate_repository_embeddings(
#     1
# )

# print(
#     f"Generated {count} embeddings"
# )


# sementic search 

    

# from services.embedding.embedding_repository import EmbeddingRepository
# from services.embedding.embedding_service import EmbeddingService


# embedding_service = EmbeddingService()
# embedding_repo = EmbeddingRepository()

# query_embedding = (
#     embedding_service.generate_embedding(
#         "where is RegisterNavbar component defined?"
#     )
# )

# results = embedding_repo.semantic_search(
#     repository_id=1,
#     query_embedding=query_embedding,
#     limit=5
# )

# for row in results:
#     print(
#         {
#             "chunk_id": row[0],
#             "chunk_type": row[1],
#             "chunk_name": row[2],
#             "file_path": row[3],
#             "score": round(row[5], 4)
#         }
#     )




# abstraction for sementic search 

from services.retrieval.retrieval_service import (
    RetrievalService
)

service = RetrievalService()

results = service.semantic_search(
    1,
    "login page"
)

print(len(results))