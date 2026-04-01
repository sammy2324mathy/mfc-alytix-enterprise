from fastapi import APIRouter

router = APIRouter()

feature_store = {}


@router.post("/")
def register_feature(name: str, description: str):
    feature_store[name] = description
    return {"name": name, "description": description}


@router.get("/")
def list_features():
    return feature_store
