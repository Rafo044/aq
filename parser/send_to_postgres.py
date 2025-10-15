import psycopg2
import os
from loguru import logger
from psycopg2 import sql
from pathlib import Path

current_dir = Path(os.getcwd())
log_dir = current_dir / "logs"
log_dir.mkdir(parents=True, exist_ok=True)

logger.add(log_dir / "logs.log", rotation="100 MB")


def insert_dict_to_postgres(dict_data: dict, db: str, table_name: str):
    """
    Inserts a dictionary into a PostgreSQL table.

    Args:
        dict_data (dict): The dictionary to insert.
        table_name (str): The name of the table to insert into.

    Returns:
        None
    """
    try:
        conn = psycopg2.connect(
            host=os.getenv("POSTGRES_HOST"),
            database=db,
            port=os.getenv("POSTGRES_PORT"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
        )
        cursor = conn.cursor()
        cols = list(dict_data.keys())
        values = [dict_data[c] for c in cols]

        query = sql.SQL(
            "INSERT INTO {table} ({fields}) VALUES ({placeholders})"
        ).format(
            table=sql.Identifier(table_name),
            fields=sql.SQL(", ").join(map(sql.Identifier, cols)),
            placeholders=sql.SQL(", ").join([sql.Placeholder()] * len(cols)),
        )
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        logger.error(f"Error inserting data into PostgreSQL: {e}")
