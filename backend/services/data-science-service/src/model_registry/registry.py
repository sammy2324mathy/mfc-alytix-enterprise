import uuid
from typing import Dict, Any

class ModelRegistry:
    def __init__(self):
        self._models: Dict[str, Dict[str, Any]] = {}
        self._experiments: Dict[str, list] = {}

    def register_model(self, model_name: str, version: str, metadata: Dict[str, Any]) -> str:
        model_id = str(uuid.uuid4())
        self._models[model_id] = {
            "name": model_name,
            "version": version,
            "metadata": metadata,
            "status": "Staging"
        }
        return model_id

    def list_models(self) -> Dict[str, Dict[str, Any]]:
        return self._models

registry = ModelRegistry()
