import requests
from typing import Dict, Optional


class ExternalTaxCalculator:
    """
    Infrastructure Service: External Tax Calculator

    Handles communication with external tax APIs.
    Falls back to local calculation if API is unavailable.
    """

    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key

    # -------------------------------
    # External API Call
    # -------------------------------
    def calculate_tax_external(self, income: float) -> Dict:
        if not self.base_url:
            raise ValueError("External tax API URL not configured")

        try:
            response = requests.post(
                f"{self.base_url}/calculate-tax",
                json={"income": income},
                headers={"Authorization": f"Bearer {self.api_key}"} if self.api_key else {},
                timeout=5,
            )

            response.raise_for_status()
            return response.json()

        except requests.RequestException as e:
            return {
                "status": "error",
                "message": f"External tax service failed: {str(e)}"
            }

    # -------------------------------
    # Fallback (Local Calculation)
    # -------------------------------
    def calculate_tax_local(self, income: float) -> Dict:
        """
        Simple fallback progressive tax (can align with TaxService later)
        """
        if income <= 1000:
            tax = 0
        elif income <= 5000:
            tax = (income - 1000) * 0.1
        elif income <= 10000:
            tax = (4000 * 0.1) + (income - 5000) * 0.2
        else:
            tax = (4000 * 0.1) + (5000 * 0.2) + (income - 10000) * 0.3

        return {
            "income": income,
            "tax": round(tax, 2),
            "source": "local_fallback"
        }

    # -------------------------------
    # Unified Interface
    # -------------------------------
    def calculate_tax(self, income: float, use_external: bool = True) -> Dict:
        """
        Main entry point.
        Tries external first, falls back to local.
        """
        if use_external and self.base_url:
            result = self.calculate_tax_external(income)

            if result.get("status") != "error":
                result["source"] = "external_api"
                return result

        # fallback
        return self.calculate_tax_local(income)