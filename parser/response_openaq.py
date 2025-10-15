import requests
from datetime import datetime, timedelta
from urllib.parse import quote
import os
from loguru import logger
from pathlib import Path

current_dir = Path(os.getcwd())

log_dir = current_dir / "logs"
log_dir.mkdir(parents=True, exist_ok=True)
logger.add(log_dir / "logs.log")


def get_response(sensor_id: str, start_date: str, delta_days: int) -> dict:
    """
    This function generates a response dictionary for a given sensor ID, start date, and delta days.

    Args:
        sensor_id (str): The ID of the sensor.
        start_date (str): The start date in the format "YYYY-MM-DD".
        delta_days (int): The number of days to include in the response.

    Returns:
        dict: The response dictionary.
    """

    datetime_from = datetime.strptime(start_date, "%Y-%m-%d")
    datetime_to = quote(
        (datetime_from + timedelta(days=delta_days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    )
    datetime_from = quote(datetime_from.strftime("%Y-%m-%dT%H:%M:%SZ"))
    headers = {"X-API-Key": os.getenv("OPENAQ_API_KEY")}
    url = f"https://api.openaq.org/v3/sensors/{sensor_id}/measurements/daily?datetime_to={datetime_to}&datetime_from={datetime_from}&limit=100&page=1"

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        logger.error(f"Requests failed : {response.status_code} - {response.text}")
