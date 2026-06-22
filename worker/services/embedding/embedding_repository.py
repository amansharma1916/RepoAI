from database.postgres import get_connection
from dotenv import load_dotenv
load_dotenv()


class EmbeddingRepository:

    def save_embeddings(
        self,
        repository_id: int,
        embeddings
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            DELETE FROM repository_embeddings
            WHERE repository_id = %s
            """,
            (repository_id,)
        )

        for item in embeddings:

            cursor.execute(
                """
                INSERT INTO repository_embeddings (
                    repository_id,
                    chunk_id,
                    model_name,
                    embedding
                )
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s
                )
                """,
                (
                    repository_id,
                    item["chunk_id"],
                    item["model_name"],
                    item["embedding"]
                )
            )

        conn.commit()

        cursor.close()
        conn.close()


    def get_embedding_count(
        self,
        repository_id: int
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM repository_embeddings
            WHERE repository_id = %s
            """,
            (repository_id,)
        )

        count = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return count


    def get_embeddings(
        self,
        repository_id: int
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                repository_id,
                chunk_id,
                model_name,
                created_at
            FROM repository_embeddings
            WHERE repository_id = %s
            ORDER BY id
            """,
            (repository_id,)
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows



    def semantic_search(
        self,
        repository_id: int,
        query_embedding,
        limit: int = 10
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                c.id,
                c.chunk_type,
                c.chunk_name,
                c.file_path,
                c.content,
                1 - (
                    e.embedding <=> %s::vector
                ) AS similarity_score
            FROM repository_embeddings e
            JOIN repository_chunks c
                ON c.id = e.chunk_id
            WHERE e.repository_id = %s
            ORDER BY
                e.embedding <=> %s::vector
            LIMIT %s
            """,
            (
                query_embedding,
                repository_id,
                query_embedding,
                limit
            )
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows









