from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class PlateBase(BaseModel):
    plate: str = Field(..., examples=["34 ABC 123"])
    owner_name: str = Field(..., examples=["Ahmet Yılmaz"])
    phone: Optional[str] = None
    note: Optional[str] = None


class PlateCreate(PlateBase):
    pass


class PlateUpdate(BaseModel):
    plate: Optional[str] = None
    owner_name: Optional[str] = None
    phone: Optional[str] = None
    note: Optional[str] = None


class PlateOut(PlateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class EntryCreate(BaseModel):
    plate: str
    camera: Optional[str] = None
    timestamp: Optional[datetime] = None
    confidence: Optional[int] = None


class EntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plate: str
    camera: Optional[str] = None
    timestamp: datetime
    confidence: Optional[int] = None


class BulkEntries(BaseModel):
    entries: List[EntryCreate]


class DailyReport(BaseModel):
    date: date
    total_entries: int
    unique_plates: int
    entries: List[EntryOut]


class MonthlyReportDay(BaseModel):
    date: date
    total_entries: int
    unique_plates: int


class MonthlyReport(BaseModel):
    year: int
    month: int
    total_entries: int
    total_unique_plates: int
    days: List[MonthlyReportDay]
