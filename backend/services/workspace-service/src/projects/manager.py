import uuid
from typing import Dict, Any

class ProjectManager:
    def __init__(self):
        self._projects: Dict[str, Dict[str, Any]] = {}

    def create_project(self, name: str, description: str, owner: str) -> str:
        project_id = str(uuid.uuid4())
        self._projects[project_id] = {
            "name": name,
            "description": description,
            "owner": owner,
            "status": "Active"
        }
        return project_id

    def list_projects(self) -> Dict[str, Dict[str, Any]]:
        return self._projects

manager = ProjectManager()
