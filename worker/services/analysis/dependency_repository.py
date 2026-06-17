from database.postgres import get_connection
from dotenv import load_dotenv

load_dotenv()

class DependencyRepository:

    def save_dependencies(
        self,
        repository_id: int,
        dependencies
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            DELETE FROM repository_dependencies
            WHERE repository_id = %s
            """,
            (repository_id,)
        )

        for dependency in dependencies:

            cursor.execute(
                """
                INSERT INTO repository_dependencies (
                    repository_id,
                    source_file,
                    target,
                    resolved_path,
                    dependency_type,
                    is_internal
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    repository_id,
                    dependency.source_file,
                    dependency.target,
                    dependency.resolved_path,
                    dependency.dependency_type,
                    dependency.is_internal
                )
            )

        conn.commit()

        cursor.close()
        conn.close()


    def get_dependencies(
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
                source_file,
                target,
                resolved_path,
                dependency_type,
                is_internal,
                created_at
            FROM repository_dependencies
            WHERE repository_id = %s
            ORDER BY id
            """,
            (repository_id,)
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows
