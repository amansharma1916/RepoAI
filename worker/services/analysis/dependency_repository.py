from database.postgres import get_connection
from dotenv import load_dotenv

from services.utils.path_utils import to_repo_path

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

            source_file = to_repo_path(
                dependency.source_file
            )

            resolved_path = to_repo_path(
                dependency.resolved_path
            )

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
                    source_file,
                    dependency.target,
                    resolved_path,
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

    def get_file_dependents(
        self,
        repository_id: int,
        file_path: str
    ):
        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT source_file
            FROM repository_dependencies
            WHERE repository_id = %s
            AND resolved_path = %s
            AND is_internal = TRUE
            ORDER BY source_file
            """,
            (repository_id, file_path)
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows

    def get_file_dependencies(
        self,
        repository_id: int,
        file_path: str
    ):
        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                resolved_path
            FROM repository_dependencies
            WHERE repository_id = %s
            AND source_file = %s
            AND is_internal = TRUE
            ORDER BY resolved_path
            """,
            (
                repository_id,
                file_path
            )
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows






    def get_dependency_count(
        self,
        repository_id: int
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM repository_dependencies
            WHERE repository_id = %s
            """,
            (repository_id,)
        )

        count = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return count