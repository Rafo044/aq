from transform import normalize_measurement
from response_openaq import get_response
from validation_json import OpenAQResponse
from send_to_postgres import insert_dict_to_postgres
import os
from dotenv import load_dotenv
from loguru import logger
from leanage_logger import log_lineage
from datetime import datetime, timedelta

logger.add("logs/logs.log")
load_dotenv()
start = int(os.getenv("START"))
stop = int(os.getenv("STOP"))
step = int(os.getenv("STEP"))


def main():
    logger.info("Starting main function")

    for i in range(start, stop, step):
        start_date = datetime.strptime(os.getenv("START_DATE"), "%Y-%m-%d") + timedelta(
            days=i
        )
        start_date = start_date.strftime("%Y-%m-%d")
        try:
            log_lineage(
                tool="Python",
                source="OpenAQ",
                target="Requests",
                process="Requests from OpenAQ",
            )
            response = get_response(
                sensor_id=os.getenv("SENSOR_ID"),
                start_date=start_date,
                delta_days=1,
            )
            log_lineage(
                tool="Python",
                source="Requests",
                target="Validation",
                process="Validation data",
            )
            validated = OpenAQResponse.model_validate(response)

            log_lineage(
                tool="Python",
                source="Validation",
                target="Transform",
                process="Transform data",
            )
            normalized_data = normalize_measurement(response["results"][0])

            log_lineage(
                tool="Python",
                source="Transform",
                target="Database",
                process="Send to database",
            )
            insert_dict_to_postgres(
                dict_data=normalized_data,
                db=os.getenv("POSTGRES_DB"),
                table_name="measurements",
            )
            logger.success(
                f"Data successfully inserted into database - Period {i}  - Start Date : {start_date}"
            )
        except Exception as e:
            logger.error(f"Error : {e}")
            raise
            break


if __name__ == "__main__":
    main()
