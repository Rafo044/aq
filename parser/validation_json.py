from pydantic import BaseModel
from typing import List


class OpenAQResponse(BaseModel):
    class DateTimeRange(BaseModel):
        utc: str
        local: str

    class Period(BaseModel):
        label: str
        interval: str
        datetimeFrom: "OpenAQResponse.DateTimeRange"
        datetimeTo: "OpenAQResponse.DateTimeRange"

    class Parameter(BaseModel):
        id: int
        name: str
        units: str
        displayName: str | None = None

    class FlagInfo(BaseModel):
        hasFlags: bool

    class Summary(BaseModel):
        min: float
        q02: float
        q25: float
        median: float
        q75: float
        q98: float
        max: float
        avg: float
        sd: float

    class Coverage(BaseModel):
        expectedCount: int
        expectedInterval: str
        observedCount: int
        observedInterval: str
        percentComplete: float
        percentCoverage: float
        datetimeFrom: "OpenAQResponse.DateTimeRange"
        datetimeTo: "OpenAQResponse.DateTimeRange"

    class Result(BaseModel):
        value: float
        flagInfo: "OpenAQResponse.FlagInfo"
        parameter: "OpenAQResponse.Parameter"
        period: "OpenAQResponse.Period"
        coordinates: dict | None = None
        summary: "OpenAQResponse.Summary"
        coverage: "OpenAQResponse.Coverage"

    class Meta(BaseModel):
        name: str
        website: str
        page: int
        limit: int
        found: int

    meta: "OpenAQResponse.Meta"
    results: List["OpenAQResponse.Result"]
