from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from db import Base


class Plate(Base):
    __tablename__ = "plates"

    id = Column(Integer, primary_key=True, index=True)
    plate = Column(String, unique=True, index=True, nullable=False)
    owner_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    note = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Entry(Base):
    __tablename__ = "entries"

    id = Column(Integer, primary_key=True, index=True)
    plate = Column(String, index=True, nullable=False)
    camera = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    confidence = Column(Integer, nullable=True)
