import json

from database.postgres import get_connection

from dotenv import load_dotenv

load_dotenv()

def save_repository_stats(repository_id, stats):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO repository_stats
        (
            repository_id,
            total_files,
            total_folders,
            total_size,
            languages
        )
        VALUES (%s,%s,%s,%s,%s)
        ON CONFLICT (repository_id)
        DO UPDATE SET
            total_files = EXCLUDED.total_files,
            total_folders = EXCLUDED.total_folders,
            total_size = EXCLUDED.total_size,
            languages = EXCLUDED.languages
        """,
        (
            repository_id,
            stats["total_files"],
            stats["total_folders"],
            stats["total_size"],
            json.dumps(stats["languages"])
        )
    )

    conn.commit()

    cursor.close()
    conn.close()