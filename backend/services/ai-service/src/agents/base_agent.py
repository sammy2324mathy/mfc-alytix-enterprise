from typing import Any, Dict
import datetime
import uuid


class BaseAgent:
    """
    Base class for all AI agents.

    Provides:
    - Standard interface
    - Logging
    - Execution tracking
    """

    def __init__(self, name: str):
        self.name = name
        self.agent_id = str(uuid.uuid4())

    # -------------------------------
    # Execute (Main Entry Point)
    # -------------------------------
    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Standard execution pipeline
        """
        start_time = datetime.datetime.utcnow()

        try:
            result = self.execute(input_data)

            status = "success"
            error = None

        except Exception as e:
            result = None
            status = "error"
            error = str(e)

        end_time = datetime.datetime.utcnow()

        return {
            "agent": self.name,
            "agent_id": self.agent_id,
            "status": status,
            "input": input_data,
            "output": result,
            "error": error,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "duration_seconds": (end_time - start_time).total_seconds(),
        }

    # -------------------------------
    # Core Logic (Override This)
    # -------------------------------
    def execute(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Must be implemented by child classes
        """
        raise NotImplementedError("Agents must implement execute()")

    # -------------------------------
    # Logging Helper
    # -------------------------------
    def log(self, message: str):
        print(f"[{self.name}] {datetime.datetime.utcnow().isoformat()} - {message}")

    # -------------------------------
    # Validation Hook
    # -------------------------------
    def validate_input(self, input_data: Dict[str, Any]):
        """
        Override if needed
        """
        if not isinstance(input_data, dict):
            raise ValueError("Input must be a dictionary")

    # -------------------------------
    # Health Check
    # -------------------------------
    def health(self) -> Dict[str, Any]:
        return {
            "agent": self.name,
            "status": "healthy",
            "agent_id": self.agent_id
        }