"""BI Dashboards API — published dashboard catalog."""

from fastapi import APIRouter
from typing import List

from src.api.schemas.ds_schemas import DashboardSummary

router = APIRouter()

DASHBOARDS: List[DashboardSummary] = [
    DashboardSummary(dashboard_id="DB-01", name="Executive Claims Summary", audience="C-Suite", views_mtd=2340, refresh_rate="Daily", status="active"),
    DashboardSummary(dashboard_id="DB-02", name="Underwriting Risk Heatmap", audience="Underwriting", views_mtd=1820, refresh_rate="Hourly", status="active"),
    DashboardSummary(dashboard_id="DB-03", name="Premium Revenue Tracker", audience="Finance", views_mtd=1450, refresh_rate="Daily", status="active"),
    DashboardSummary(dashboard_id="DB-04", name="Fraud Monitoring Console", audience="Investigations", views_mtd=3100, refresh_rate="Real-time", status="active"),
    DashboardSummary(dashboard_id="DB-05", name="Customer Retention Insights", audience="Marketing", views_mtd=890, refresh_rate="Weekly", status="active"),
    DashboardSummary(dashboard_id="DB-06", name="Actuarial Reserving Dashboard", audience="Actuarial", views_mtd=620, refresh_rate="Monthly", status="maintenance"),
]


@router.get("/", response_model=List[DashboardSummary])
def list_dashboards():
    return DASHBOARDS


@router.get("/{dashboard_id}")
def get_dashboard(dashboard_id: str):
    for d in DASHBOARDS:
        if d.dashboard_id == dashboard_id:
            return {
                **d.model_dump(),
                "widgets": [
                    {"type": "metric_card", "title": "Total Claims", "value": "4,291"},
                    {"type": "bar_chart", "title": "Claims by Region", "data_points": 8},
                    {"type": "line_chart", "title": "Monthly Trend", "data_points": 12},
                    {"type": "table", "title": "Top 10 Claimants", "rows": 10},
                ],
            }
    return {"error": "Dashboard not found"}
