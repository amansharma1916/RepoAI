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