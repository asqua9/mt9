from datetime import date, datetime, timedelta
from typing import List

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from db import Base, SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MT9 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/plates", response_model=List[schemas.PlateOut])
def list_plates(db: Session = Depends(get_db)):
    return db.query(models.Plate).order_by(models.Plate.created_at.desc()).all()


@app.post("/plates", response_model=schemas.PlateOut)
def create_plate(payload: schemas.PlateCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Plate).filter(models.Plate.plate == payload.plate).first()
    if existing:
        raise HTTPException(status_code=409, detail="Plate already exists")
    plate = models.Plate(
        plate=payload.plate,
        owner_name=payload.owner_name,
        phone=payload.phone,
        note=payload.note,
    )
    db.add(plate)
    db.commit()
    db.refresh(plate)
    return plate


@app.put("/plates/{plate_id}", response_model=schemas.PlateOut)
def update_plate(plate_id: int, payload: schemas.PlateUpdate, db: Session = Depends(get_db)):
    plate = db.query(models.Plate).filter(models.Plate.id == plate_id).first()
    if not plate:
        raise HTTPException(status_code=404, detail="Plate not found")
    if payload.plate and payload.plate != plate.plate:
        existing = db.query(models.Plate).filter(models.Plate.plate == payload.plate).first()
        if existing:
            raise HTTPException(status_code=409, detail="Plate already exists")
        plate.plate = payload.plate
    if payload.owner_name is not None:
        plate.owner_name = payload.owner_name
    if payload.phone is not None:
        plate.phone = payload.phone
    if payload.note is not None:
        plate.note = payload.note
    db.commit()
    db.refresh(plate)
    return plate


@app.delete("/plates/{plate_id}")
def delete_plate(plate_id: int, db: Session = Depends(get_db)):
    plate = db.query(models.Plate).filter(models.Plate.id == plate_id).first()
    if not plate:
        raise HTTPException(status_code=404, detail="Plate not found")
    db.delete(plate)
    db.commit()
    return {"ok": True}


@app.post("/entries/bulk")
def create_entries(payload: schemas.BulkEntries, db: Session = Depends(get_db)):
    if not payload.entries:
        return {"inserted": 0}
    entries = []
    for entry in payload.entries:
        timestamp = entry.timestamp or datetime.utcnow()
        entries.append(
            models.Entry(
                plate=entry.plate,
                camera=entry.camera,
                timestamp=timestamp,
                confidence=entry.confidence,
            )
        )
    db.add_all(entries)
    db.commit()
    return {"inserted": len(entries)}


@app.get("/reports/daily", response_model=schemas.DailyReport)
def daily_report(
    report_date: date = Query(..., alias="date"),
    db: Session = Depends(get_db),
):
    start = datetime.combine(report_date, datetime.min.time())
    end = datetime.combine(report_date, datetime.max.time())
    entries = (
        db.query(models.Entry)
        .filter(models.Entry.timestamp >= start, models.Entry.timestamp <= end)
        .order_by(models.Entry.timestamp.desc())
        .all()
    )
    unique_plates = len({entry.plate for entry in entries})
    return schemas.DailyReport(
        date=report_date,
        total_entries=len(entries),
        unique_plates=unique_plates,
        entries=entries,
    )


@app.get("/reports/monthly", response_model=schemas.MonthlyReport)
def monthly_report(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db: Session = Depends(get_db),
):
    first_day = date(year, month, 1)
    last_day = (first_day.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
    start = datetime.combine(first_day, datetime.min.time())
    end = datetime.combine(last_day, datetime.max.time())

    entries = (
        db.query(models.Entry)
        .filter(models.Entry.timestamp >= start, models.Entry.timestamp <= end)
        .all()
    )

    day_map = {}
    for entry in entries:
        entry_date = entry.timestamp.date()
        if entry_date not in day_map:
            day_map[entry_date] = {"total": 0, "plates": set()}
        day_map[entry_date]["total"] += 1
        day_map[entry_date]["plates"].add(entry.plate)

    days = []
    total_entries = 0
    total_unique_plates = set()
    current_day = first_day
    while current_day <= last_day:
        day_stats = day_map.get(current_day, {"total": 0, "plates": set()})
        total_entries += day_stats["total"]
        total_unique_plates.update(day_stats["plates"])
        days.append(
            schemas.MonthlyReportDay(
                date=current_day,
                total_entries=day_stats["total"],
                unique_plates=len(day_stats["plates"]),
            )
        )
        current_day += timedelta(days=1)

    return schemas.MonthlyReport(
        year=year,
        month=month,
        total_entries=total_entries,
        total_unique_plates=len(total_unique_plates),
        days=days,
    )
