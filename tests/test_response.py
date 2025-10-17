from dotenv import load_dotenv
from parser.response_openaq import get_response

from parser.send_to_postgres import insert_dict_to_postgres
from parser.transform import normalize_measurement
from parser.validation_json import OpenAQResponse

import pytest


load_dotenv()

# ========================================================================================================
#                                   TEST DATA
# ========================================================================================================


test_list = [
    (4679, "2025-01-05", 1),
    (469, "2021-09-01", 1),
    (4679, "2025-03-05", 1),
    (469, "2024-09-01", 2),
    (4679, "2018-01-05", 1),
    (469, "2024-09-01", 1),
    (4679, "2023-01-05", 1),
    (469, "2025-09-11", 1),
]


# ========================================================================================================
#                                   HELPER FUNCTIONS
# ========================================================================================================


def fetch_get_response(*args, **kwargs):
    response_json = get_response(*args, **kwargs)
    if response_json["results"] == []:
        assert False, "No results found"
    else:
        return response_json


def model_validate(response_json):
    validated = OpenAQResponse.model_validate(response_json)
    return validated.model_dump()


def transformed_data(validated):
    normalized_data = normalize_measurement(validated["results"][0])
    return normalized_data


def send_to_postgres():
    insert_dict_to_postgres(pos)


# ========================================================================================================
#                                   FIXTURE FUNCTIONS
# ========================================================================================================


@pytest.fixture(params=test_list)
def fixture_get_response(request):
    sensor_id, start_date, delta_days = request.param
    response_json = fetch_get_response(sensor_id, start_date, delta_days)
    return response_json


@pytest.fixture
def fixture_validated_data(fixture_get_response):
    validated_data = model_validate(fixture_get_response)
    return validated_data


@pytest.fixture
def fixture_transformed_data(fixture_validated_data):
    return transformed_data(fixture_validated_data)


# ========================================================================================================
#                                   TEST FUNCTIONS
# ========================================================================================================


def test_get_response(fixture_get_response):
    assert fixture_get_response is not None, "No data available"


def test_transformed_data(fixture_transformed_data):
    assert fixture_transformed_data is not None


# ========================================================================================================
