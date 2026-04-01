import logging
import json
import time
from typing import Any, Dict, Optional

class AuditLogger:
    """Structured logger for security and audit events."""
    
    def __init__(self, name: str = "audit"):
        self.logger = logging.getLogger(name)
        self._setup_logger()
    
    def _setup_logger(self):
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)
    
    def log_event(
        self, 
        event_type: str, 
        user_id: Optional[str] = None,
        action: str = "unknown",
        resource: str = "unknown",
        status: str = "success",
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None
    ):
        """Log a structured audit event."""
        event = {
            "timestamp": time.time(),
            "event_type": event_type,
            "user_id": user_id,
            "action": action,
            "resource": resource,
            "status": status,
            "details": details or {},
            "request_id": request_id
        }
        self.logger.info(json.dumps(event))

# Global audit logger instance
audit_logger = AuditLogger()
