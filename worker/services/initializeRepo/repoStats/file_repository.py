from database.postgres import get_connection
from dotenv import load_dotenv

load_dotenv()


def save_repository_files(repository_id, files):

    conn = get_connection()
    cursor = conn.cursor()

    rows = []

    for file in files:
        rows.append(
            (
                repository_id,
                file["file_name"],
                file["file_path"],
                file["extension"],
                file["size"]
            )
        )

    cursor.executemany(
        """
        INSERT INTO repository_files
        (
            repository_id,
            file_name,
            file_path,
            extension,
            size
        )
        VALUES (%s, %s, %s, %s, %s)
        """,
        rows
    )

    conn.commit()

    cursor.close()
    conn.close()



def get_repository_files(
    repository_id: int
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            file_name,
            file_path,
            extension,
            size
        FROM repository_files
        WHERE repository_id = %s
        ORDER BY file_path
        """,
        (repository_id,)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows


def get_file_path(
    repository_id: int,
    file_path: str
):

    conn = get_connection()

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT file_path
        FROM repository_files
        WHERE repository_id = %s
        AND file_path = %s
        """,
        (
            repository_id,
            file_path
        )
    )

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    return row
