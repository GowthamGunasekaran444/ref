
def build_in_clause(column_name, values, param_dict):
    """
    Dynamically build a safe IN clause for SQL Server.
    Example:
        build_in_clause('bu', ['India','US'], params)
        → returns "bu IN (:bu_0, :bu_1)"
    """
    if not values:
        return None

    placeholders = []
    for i, val in enumerate(values):
        key = f"{column_name}_{i}"
        param_dict[key] = val
        placeholders.append(f":{key}")
    return f"{column_name} IN ({', '.join(placeholders)})"
🧩 schema.py
from pydantic import BaseModel
from typing import List, Optional

# --- Schema for Cascade Filter ---
class CascadeFilter(BaseModel):
    bg: Optional[List[str]] = None
    bu: Optional[List[str]] = None
    country: Optional[List[str]] = None
    plant: Optional[List[str]] = None
    time: Optional[List[str]] = None  # year_month column

# --- Schema for RiskType Filter ---
class RiskFilter(BaseModel):
    bg: Optional[List[str]] = None
    bu: Optional[List[str]] = None
    country: Optional[List[str]] = None
    plant: Optional[List[str]] = None
    time: Optional[List[str]] = None
    riskType: str  # Supplier | Compliance | Performance


🗃️ repository.py
from sqlalchemy import text

# --- CASCADE FILTER QUERY ---
def get_distinct_values_from_view(db, filters):
    query = """
        SELECT DISTINCT 
            bg, bu, country, plant, year_month
        FROM vw_list
    """
    conditions = []
    params = {}

    if filters.bg:
        conditions.append("bg IN :bg")
        params["bg"] = tuple(filters.bg)
    if filters.bu:
        conditions.append("bu IN :bu")
        params["bu"] = tuple(filters.bu)
    if filters.country:
        conditions.append("country IN :country")
        params["country"] = tuple(filters.country)
    if filters.plant:
        conditions.append("plant IN :plant")
        params["plant"] = tuple(filters.plant)
    if filters.time:
        conditions.append("year_month IN :time")
        params["time"] = tuple(filters.time)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    result = db.execute(text(query), params)
    return result.fetchall()


# --- RISK TYPE QUERY ---
def get_risk_data_by_type(db, filters):
    query = """
        SELECT 
            risk_label,
            SUM(risk_score * total_incidence) AS weighted_score,
            SUM(total_incidence) AS total_incidence
        FROM vw_list
        WHERE risk_type = :riskType
    """
    conditions = []
    params = {"riskType": filters.riskType}

    if filters.bg:
        conditions.append("bg IN :bg")
        params["bg"] = tuple(filters.bg)
    if filters.bu:
        conditions.append("bu IN :bu")
        params["bu"] = tuple(filters.bu)
    if filters.country:
        conditions.append("country IN :country")
        params["country"] = tuple(filters.country)
    if filters.plant:
        conditions.append("plant IN :plant")
        params["plant"] = tuple(filters.plant)
    if filters.time:
        conditions.append("year_month IN :time")
        params["time"] = tuple(filters.time)

    if conditions:
        query += " AND " + " AND ".join(conditions)

    query += " GROUP BY risk_label"

    result = db.execute(text(query), params)
    return result.fetchall()
⚙️ service.py
from repository import get_distinct_values_from_view, get_risk_data_by_type

# --- CASCADE SERVICE ---
def get_cascade_data(db, filters):
    rows = get_distinct_values_from_view(db, filters)
    distinct_data = {
        "bg": sorted({row.bg for row in rows if row.bg}),
        "bu": sorted({row.bu for row in rows if row.bu}),
        "country": sorted({row.country for row in rows if row.country}),
        "plant": sorted({row.plant for row in rows if row.plant}),
        "time": sorted({row.year_month for row in rows if row.year_month}),
    }
    return distinct_data


# --- RISK SERVICE ---
def calculate_average_and_distribution(rows):
    total_weighted_score = 0
    total_incidence = 0
    label_counts = {}

    for row in rows:
        label = row.risk_label.lower()
        weighted_score = row.weighted_score or 0
        incidence = row.total_incidence or 0
        total_weighted_score += weighted_score
        total_incidence += incidence
        label_counts[label] = incidence

    avg_score = 0
    if total_incidence > 0:
        avg_score = total_weighted_score / total_incidence

    distribution = {}
    for label, count in label_counts.items():
        if total_incidence > 0:
            distribution[label] = round((count / total_incidence) * 100, 2)
        else:
            distribution[label] = 0.0

    for label in ["high", "medium", "low"]:
        distribution.setdefault(label, 0.0)

    return {
        "average_risk_score": round(avg_score, 2),
        "distribution": distribution
    }


def get_risk_summary(db, filters):
    rows = get_risk_data_by_type(db, filters)
    return calculate_average_and_distribution(rows)


🧠 controller.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schema import CascadeFilter, RiskFilter
from service import get_cascade_data, get_risk_summary

router = APIRouter()

# --- CASCADE FILTER API ---
@router.post("/cascade-filter")
def cascade_filter(filters: CascadeFilter, db: Session = Depends(get_db)):
    result = get_cascade_data(db, filters)
    return {"status": "success", "data": result}


# --- RISK SUMMARY API ---
@router.post("/get-risk-by-type")
def get_risk_by_type(filters: RiskFilter, db: Session = Depends(get_db)):
    result = get_risk_summary(db, filters)
    return {"status": "success", "data": result}

app.include_router(main_router, prefix="/api", tags=["Risk Analysis"])



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -----------------------------------------------
// 🧩 API Endpoints (adjust if needed)
const BASE_URL = "http://127.0.0.1:8000/api";

// -----------------------------------------------
// 🎯 1️⃣ Fetch Cascading Filter Data
export const fetchCascadeFilters = createAsyncThunk(
  "risk/fetchCascadeFilters",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/cascade-filter`, filters);
      return response.data.data; // expecting { bg, bu, country, plant, time }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cascading filters"
      );
    }
  }
);

// -----------------------------------------------
// 🎯 2️⃣ Fetch Risk Summary by Type
export const fetchRiskSummary = createAsyncThunk(
  "risk/fetchRiskSummary",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/get-risk-by-type`, filters);
      return response.data.data; // expecting { average_risk_score, distribution }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch risk summary"
      );
    }
  }
);

// -----------------------------------------------
// 🧱 Initial State
const initialState = {
  cascadingFilters: {
    defaultValues: {
      bg: [],
      bu: [],
      country: [],
      plant: [],
      time: [],
    },
    filteredValues: {
      bg: [],
      bu: [],
      country: [],
      plant: [],
      time: [],
    },
  },
  appliedFilters: {
    bg: [],
    bu: [],
    country: [],
    plant: [],
    time: [],
    riskType: "",
  },
  riskSummary: {
    average_risk_score: 0,
    distribution: {
      high: 0,
      medium: 0,
      low: 0,
    },
  },
  loading: false,
  error: null,
};

// -----------------------------------------------
// 🧠 Slice Definition
const riskSlice = createSlice({
  name: "risk",
  initialState,
  reducers: {
    // 🧩 Update applied filters locally
    setAppliedFilters: (state, action) => {
      state.appliedFilters = { ...state.appliedFilters, ...action.payload };
    },

    // 🧩 Reset all filters
    resetFilters: (state) => {
      state.appliedFilters = initialState.appliedFilters;
    },
  },

  // -----------------------------------------------
  // ⚙️ Async Reducers (pending / fulfilled / rejected)
  extraReducers: (builder) => {
    // CASCADE FILTER HANDLERS
    builder
      .addCase(fetchCascadeFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCascadeFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.cascadingFilters.defaultValues = action.payload;
        state.cascadingFilters.filteredValues = action.payload;
      })
      .addCase(fetchCascadeFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // RISK SUMMARY HANDLERS
    builder
      .addCase(fetchRiskSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRiskSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.riskSummary = action.payload;
      })
      .addCase(fetchRiskSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// -----------------------------------------------
// 🧾 Export Actions & Reducer
export const { setAppliedFilters, resetFilters } = riskSlice.actions;
export default riskSlice.reducer;

