from database.postgres import get_connection
from dotenv import load_dotenv

load_dotenv()

class SymbolRepository:

    def save_symbols(
        self,
        repository_id: int,
        symbols
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            DELETE FROM repository_symbols
            WHERE repository_id = %s
            """,
            (repository_id,)
        )

        for symbol in symbols:

            cursor.execute(
                """
                INSERT INTO repository_symbols (
                    repository_id,
                    name,
                    symbol_type,
                    file_path,
                    language,
                    parent_symbol
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    repository_id,
                    symbol.name,
                    symbol.symbol_type,
                    symbol.file_path,
                    symbol.language,
                    getattr(symbol, "parent_symbol", None)
                )
            )

        conn.commit()

        cursor.close()
        conn.close()


    def get_symbols(
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
                name,
                symbol_type,
                file_path,
                language,
                parent_symbol,
                created_at
            FROM repository_symbols
            WHERE repository_id = %s
            ORDER BY id
            """,
            (repository_id,)
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows
    


    def get_symbol_summary(
        self,
        repository_id: int
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                symbol_type,
                COUNT(*)
            FROM repository_symbols
            WHERE repository_id = %s
            GROUP BY symbol_type
            """,
            (repository_id,)
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows



    def get_symbols_by_type(
        self,
        repository_id: int,
        symbol_type: str
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                name,
                file_path,
                language
            FROM repository_symbols
            WHERE repository_id = %s
            AND symbol_type = %s
            ORDER BY name
            """,
            (
                repository_id,
                symbol_type
            )
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows


    def search_symbols(
        self,
        repository_id: int,
        query: str
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT
                name,
                symbol_type,
                file_path,
                language
            FROM repository_symbols
            WHERE repository_id = %s
            AND LOWER(name) LIKE LOWER(%s)
            ORDER BY name
            """,
            (
                repository_id,
                f"%{query}%"
            )
        )

        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        return rows









