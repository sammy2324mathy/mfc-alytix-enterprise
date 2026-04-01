# compliance_agent.py placeholder
from typing import Dict, Any, List
import datetime


class ComplianceAgent:
    """
    AI Agent: Compliance Officer

    Capabilities:
    - Validate regulatory rules
    - Detect violations
    - Perform audit logging
    - Risk flagging
    """

    def __init__(self, name: str = "ComplianceAgent"):
        self.name = name
        self.rules = []

    # -------------------------------
    # Add Compliance Rule
    # -------------------------------
    def add_rule(self, rule_name: str, condition_fn):
        """
        condition_fn: function that returns True if compliant
        """
        self.rules.append({
            "name": rule_name,
            "check": condition_fn
        })

    # -------------------------------
    # Run Compliance Checks
    # -------------------------------
    def check(self, data: Dict[str, Any]) -> Dict:
        results = []
        violations = []

        for rule in self.rules:
            try:
                compliant = rule["check"](data)

                results.append({
                    "rule": rule["name"],
                    "status": "PASS" if compliant else "FAIL"
                })

                if not compliant:
                    violations.append(rule["name"])

            except Exception as e:
                results.append({
                    "rule": rule["name"],
                    "status": "ERROR",
                    "error": str(e)
                })
                violations.append(rule["name"])

        return {
            "compliant": len(violations) == 0,
            "violations": violations,
            "details": results
        }

    # -------------------------------
    # Risk Scoring
    # -------------------------------
    def risk_score(self, violations: List[str]) -> float:
        """
        Simple risk scoring based on number of violations
        """
        if not violations:
            return 0.0

        score = min(1.0, len(violations) * 0.2)
        return round(score, 2)

    # -------------------------------
    # Audit Log Generator
    # -------------------------------
    def generate_audit_log(self, result: Dict) -> Dict:
        return {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "agent": self.name,
            "compliant": result["compliant"],
            "violations": result["violations"],
            "risk_score": self.risk_score(result["violations"]),
            "details": result["details"]
        }

    # -------------------------------
    # Predefined Financial Rules
    # -------------------------------
    def load_default_rules(self):
        """
        Example financial/compliance rules
        """

        # Example 1: Premium must be positive
        self.add_rule(
            "Premium Positive",
            lambda d: d.get("premium", 0) > 0
        )

        # Example 2: Loss ratio within bounds
        self.add_rule(
            "Loss Ratio Reasonable",
            lambda d: 0 <= d.get("loss_ratio", 0) <= 5
        )

        # Example 3: No missing required fields
        self.add_rule(
            "Required Fields Present",
            lambda d: all(k in d for k in ["policy_id", "premium"])
        )