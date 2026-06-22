from database.postgres import get_connection
import os
from dotenv import load_dotenv

load_dotenv()


def save_technologies(repository_id, technologies):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM repository_technologies
        WHERE repository_id = %s
        """,
        (repository_id,)
    )

    rows = [
        (repository_id, technology)
        for technology in technologies
    ]

    cursor.executemany(
        """
        INSERT INTO repository_technologies
        (
            repository_id,
            technology_name
        )
        VALUES (%s, %s)
        """,
        rows
    )

    conn.commit()

    cursor.close()
    conn.close()