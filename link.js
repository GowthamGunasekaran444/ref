from sqlalchemy import Column, String, Integer, Float
from app.core.database import Base

class PlantData(Base):
    __tablename__ = "plant_data"

    BGNAME = Column(String, primary_key=True)
    BUNAME = Column(String, primary_key=True)
    COUNTRYNAME = Column(String, primary_key=True)
    PLANTNAME = Column(String, primary_key=True)
    YEAR = Column(Integer, primary_key=True)
    MONTH = Column(Integer, primary_key=True)
    TOTAL = Column(Float)
    INCIDENT = Column(Float)
    RSCORE = Column(Float)
    RLABEL = Column(String)
    RTYPE = Column(String)

🧩 controllers/filter_controller.py
from sqlalchemy.orm import Session
from app.models.plant_data_model import PlantData

def get_unique_filters(db: Session):
    """Fetch all unique values for dropdowns"""
    return {
        "business_groups": [row[0] for row in db.query(PlantData.BGNAME).distinct().all()],
        "business_units": [row[0] for row in db.query(PlantData.BUNAME).distinct().all()],
        "countries": [row[0] for row in db.query(PlantData.COUNTRYNAME).distinct().all()],
        "plants": [row[0] for row in db.query(PlantData.PLANTNAME).distinct().all()],
        "time": [f"{row[0]}-{row[1]:02d}" for row in db.query(PlantData.YEAR, PlantData.MONTH).distinct().all()]
    }


def get_cascading_filters(db: Session, bgname=None, buname=None, country=None, plant=None, year=None, month=None):
    """Fetch filtered dropdown values based on previous selection"""
    query = db.query(PlantData)

    if bgname:
        query = query.filter(PlantData.BGNAME == bgname)
    if buname:
        query = query.filter(PlantData.BUNAME == buname)
    if country:
        query = query.filter(PlantData.COUNTRYNAME == country)
    if plant:
        query = query.filter(PlantData.PLANTNAME == plant)
    if year:
        query = query.filter(PlantData.YEAR == year)
    if month:
        query = query.filter(PlantData.MONTH == month)

    return {
        "business_groups": [row[0] for row in query.with_entities(PlantData.BGNAME).distinct()],
        "business_units": [row[0] for row in query.with_entities(PlantData.BUNAME).distinct()],
        "countries": [row[0] for row in query.with_entities(PlantData.COUNTRYNAME).distinct()],
        "plants": [row[0] for row in query.with_entities(PlantData.PLANTNAME).distinct()],
        "time": [f"{row[0]}-{row[1]:02d}" for row in query.with_entities(PlantData.YEAR, PlantData.MONTH).distinct()]
    }


🧩 routers/filter_router.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.controllers.filter_controller import get_unique_filters, get_cascading_filters

router = APIRouter(prefix="/filters", tags=["Filters"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/unique")
def fetch_unique_filters(db: Session = Depends(get_db)):
    """Return all unique filter values"""
    return get_unique_filters(db)

@router.get("/cascade")
def fetch_cascading_filters(
    bgname: str = Query(None),
    buname: str = Query(None),
    country: str = Query(None),
    plant: str = Query(None),
    year: int = Query(None),
    month: int = Query(None),
    db: Session = Depends(get_db)
):
    """Return filtered cascading values"""
    return get_cascading_filters(db, bgname, buname, country, plant, year, month)

🔹 controllers/risk_controller.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.plant_data_model import PlantData

def get_risk_ordscore(db: Session, risk_ord_time: str):
    """Calculate weighted ORDSCORE percentage for given ORD_TIME"""
    if not risk_ord_time:
        return {"error": "risk_ord_time is required"}

    # Query aggregation
    result = (
        db.query(
            func.sum(PlantData.TOTAL).label("total_sum"),
            func.sum(PlantData.RSCORE).label("ordscore_sum")
        )
        .filter(PlantData.RTYPE == risk_ord_time)
        .first()
    )

    if not result or not result.total_sum:
        return {"message": f"No data found for ORD_TIME={risk_ord_time}"}

    total_sum = result.total_sum or 0
    ordscore_sum = result.ordscore_sum or 0

    # Weighted logic (SUM(RSCORE) * SUM(TOTAL)) / SUM(TOTAL)
    final_value = (ordscore_sum * total_sum) / total_sum if total_sum != 0 else 0
    percentage = round(final_value, 2)

    return {
        "risk_ord_time": risk_ord_time,
        "total_sum": total_sum,
        "ordscore_sum": ordscore_sum,
        "final_percentage": percentage
    }
🔹 Update routers/filter_router.py → Add Risk Endpoint


from app.controllers.risk_controller import get_risk_ordscore

@router.get("/risk/ordscore")
def fetch_risk_ordscore(
    risk_ord_time: str,
    db: Session = Depends(get_db)
):
    """Return computed ORDSCORE % for given risk ORD_TIME"""
    return get_risk_ordscore(db, risk_ord_time)




from app.controllers.risk_controller import get_risk_ordscore

@router.get("/risk/ordscore")
def fetch_risk_ordscore(
    risk_ord_time: str,
    db: Session = Depends(get_db)
):
    """Return computed ORDSCORE % for given risk ORD_TIME"""
    return get_risk_ordscore(db, risk_ord_time)


from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.plant_data_model import PlantData

def get_risk_ordscore(
    db: Session,
    risk_ord_time: str,
    business_groups: list[str] = None,
    business_units: list[str] = None,
    countries: list[str] = None,
    plants: list[str] = None,
    times: list[str] = None
):
    """Calculate weighted ORDSCORE% for a given ORD_TIME with optional multi-filters"""

    if not risk_ord_time:
        return {"error": "risk_ord_time is required"}

    query = db.query(
        func.sum(PlantData.TOTAL).label("total_sum"),
        func.sum(PlantData.RSCORE).label("ordscore_sum")
    ).filter(PlantData.ORD_TIME == risk_ord_time)

    # Apply optional filters
    if business_groups:
        query = query.filter(PlantData.BGNAME.in_(business_groups))
    if business_units:
        query = query.filter(PlantData.BUNAME.in_(business_units))
    if countries:
        query = query.filter(PlantData.COUNTRYNAME.in_(countries))
    if plants:
        query = query.filter(PlantData.PLANTNAME.in_(plants))
    if times:
        time_filters = []
        for t in times:
            try:
                year, month = map(int, t.split("-"))
                time_filters.append(and_(PlantData.YEAR == year, PlantData.MONTH == month))
            except Exception:
                continue
        if time_filters:
            query = query.filter(or_(*time_filters))

    result = query.first()

    if not result or not result.total_sum:
        return {"message": "No data found for given filters"}

    total_sum = result.total_sum or 0
    ordscore_sum = result.ordscore_sum or 0

    # Weighted formula
    final_value = (ordscore_sum * total_sum) / total_sum if total_sum != 0 else 0
    percentage = round(final_value, 2)

    return {
        "risk_ord_time": risk_ord_time,
        "filters": {
            "business_groups": business_groups or [],
            "business_units": business_units or [],
            "countries": countries or [],
            "plants": plants or [],
            "times": times or []
        },
        "total_sum": total_sum,
        "ordscore_sum": ordscore_sum,
        "final_percentage": percentage
    }



      from typing import List, Optional
from app.controllers.risk_controller import get_risk_ordscore

@router.get("/risk/ordscore")
def fetch_risk_ordscore(
    risk_ord_time: str,
    business_groups: Optional[List[str]] = Query(None),
    business_units: Optional[List[str]] = Query(None),
    countries: Optional[List[str]] = Query(None),
    plants: Optional[List[str]] = Query(None),
    times: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Return weighted ORDSCORE % for given ORD_TIME
    Supports multi-select filters for business group, unit, country, plant, and time
    """
    return get_risk_ordscore(
        db=db,
        risk_ord_time=risk_ord_time,
        business_groups=business_groups,
        business_units=business_units,
        countries=countries,
        plants=plants,
        times=times
    )
{
  "risk_ord_time": "COMPLIANT",
  "filters": {
    "business_groups": ["BG1"],
    "business_units": [],
    "countries": ["India", "Germany"],
    "plants": [],
    "times": ["2024-01", "2024-02"]
  },
  "total_sum": 8200.0,
  "ordscore_sum": 1560.0,
  "final_percentage": 19.02
}

