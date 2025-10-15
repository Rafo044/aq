def normalize_measurement(d: dict) -> dict:
    """
    Normalize a measurement dictionary.

    Args:
        d (dict): The measurement dictionary to normalize.

    Returns:
        dict: The normalized measurement dictionary.
        Fields:
            value (float): The value of the measurement.
            parameter_id (int): The ID of the parameter.
            parameter_name (str): The name of the parameter.
            parameter_units (str): The units of the parameter.
            datetime_from (str): The start datetime of the measurement.
            datetime_to (str): The end datetime of the measurement.
            summary_min (float): The minimum value of the measurement.
            summary_max (float): The maximum value of the measurement.
            summary_avg (float): The average value of the measurement.
            observed_count (int): The number of observations.
            percent_complete (float): The percentage of observations completed.
    """
    return {
        "value": d["value"],
        "parameter_id": d["parameter"]["id"],
        "parameter_name": d["parameter"]["name"],
        "parameter_unit": d["parameter"]["units"],
        "datetime_from": d["period"]["datetimeFrom"]["utc"],
        "datetime_to": d["period"]["datetimeTo"]["utc"],
        "summary_min": d["summary"]["min"],
        "summary_max": d["summary"]["max"],
        "summary_avg": d["summary"]["avg"],
        "observed_count": d["coverage"]["observedCount"],
        "percent_complete": d["coverage"]["percentComplete"],
    }
