from database.postgres import get_connection
from dotenv import load_dotenv
import json

from services.utils.path_utils import to_repo_path

load_dotenv()


class ChunkRepository:

    def save_chunks(
        self,
        repository_id: int,
        chunks
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            DELETE FROM repository_chunks
            WHERE repository_id = %s
            """,
            (repository_id,)
        )

        for chunk in chunks:

            file_path = to_repo_path(
                chunk["file_path"]
            )

            cursor.execute(
                """
                INSERT INTO repository_chunks (
                    repository_id,
                    symbol_id,
                    chunk_type,
                    chunk_name,
                    file_path,
                    content,
                    start_line,
                    end_line,
                    metadata
                )
                VALUES (
                    %s, %s, %s, %s, %s,
                    %s, %s, %s, %s
                )
                """,
                (
                    repository_id,
                    chunk["symbol_id"],
                    chunk["chunk_type"],
                    chunk["chunk_name"],
                    file_path,
                    chunk["content"],
                    chunk["start_line"],
                    chunk["end_line"],
                    json.dumps(
                        chunk.get(
                            "metadata",
                            {}
                        )
                    )
                )
            )
        conn.commit()

        cursor.close()
        conn.close()


    def get_chunks(
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
                symbol_id,
                chunk_type,
                chunk_name,
                file_path,
                content,
                start_line,
                end_line,
                metadata,
                created_at
            FROM repository_chunks
            WHERE repository_id = %s
            ORDER BY id
            """,
            (repository_id,)
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows


    def get_chunk_count(
        self,
        repository_id: int
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM repository_chunks
            WHERE repository_id = %s
            """,
            (repository_id,)
        )

        count = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return count


    def get_chunk_by_name(
        self,
        repository_id: int,
        chunk_name: str
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                id,
                chunk_type,
                chunk_name,
                file_path,
                content,
                start_line,
                end_line
            FROM repository_chunks
            WHERE repository_id = %s
            AND LOWER(chunk_name) = LOWER(%s)
            LIMIT 1
            """,
            (
                repository_id,
                chunk_name
            )
        )

        row = cursor.fetchone()

        cursor.close()
        conn.close()

        return row