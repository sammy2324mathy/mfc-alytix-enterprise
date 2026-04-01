from fastapi import APIRouter
from src.api.schemas.mortality_schema import MakehamGompertzRequest, MakehamGompertzResponse

router = APIRouter()

@router.post("/makeham-gompertz", response_model=MakehamGompertzResponse)
def generate_makeham_gompertz_curve(request: MakehamGompertzRequest):
    """
    Generate a Makeham-Gompertz mortality curve (qx).
    qx = alpha + beta * c^x
    where x is the age.
    """
    curve = []
    # Project from age 0 to max_age
    for x in range(request.max_age + 1):
        qx = request.alpha + request.beta * (request.c ** x)
        # Cap qx at 1.0
        qx = min(qx, 1.0)
        curve.append({"age": x, "qx": qx})
    
    return {"curve": curve}
