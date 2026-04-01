from fastapi import APIRouter
import numpy as np
from src.api.schemas.survival_schema import KaplanMeierRequest

router = APIRouter()


@router.post("/kaplan-meier")
def kaplan_meier(payload: KaplanMeierRequest):
    durations = np.array(payload.durations)
    events = np.array(payload.events)
    order = np.argsort(durations)
    durations = durations[order]
    events = events[order]
    n = len(durations)
    at_risk = n
    survival = 1.0
    curve = []
    last_t = 0
    for t, e in zip(durations, events):
        if t != last_t:
            last_t = t
        if e == 1:
            survival *= (1 - 1 / at_risk)
        at_risk -= 1
        curve.append({"time": float(t), "survival": float(survival)})
    return {"survival_curve": curve}
