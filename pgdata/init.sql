


CREATE TABLE IF NOT EXISTS measurements (
    measurement_id SERIAL PRIMARY KEY,
    parameter_id INT ,
    parameter_name TEXT NOT NULL,
    parameter_unit TEXT NOT NULL,
    value NUMERIC,
    datetime_from TIMESTAMPTZ,
    datetime_to TIMESTAMPTZ,
    summary_min NUMERIC,
    summary_max NUMERIC,
    summary_avg NUMERIC,
    observed_count INT,
    percent_complete NUMERIC,
    sensor_id INT DEFAULT 4679,
    country_id TEXT DEFAULT 'United Kingdom');
