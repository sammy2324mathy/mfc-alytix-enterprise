from typing import List, Dict
import numpy as np


class ReserveCalculator:
    """
    Actuarial Reserve Calculator

    Computes:
    - Present value of future liabilities
    - Reserve estimates
    - Cash flow projections
    """

    # -------------------------------
    # Discount Factor
    # -------------------------------
    def discount_factor(self, rate: float, t: float) -> float:
        """
        Computes discount factor: 1 / (1 + r)^t
        """
        return 1 / ((1 + rate) ** t)

    # -------------------------------
    # Present Value of Cash Flows
    # -------------------------------
    def present_value(self, cash_flows: List[float], rate: float) -> float:
        """
        PV = Σ CF_t / (1 + r)^t
        """
        pv = 0.0

        for t, cf in enumerate(cash_flows, start=1):
            pv += cf * self.discount_factor(rate, t)

        return round(pv, 6)

    # -------------------------------
    # Reserve Calculation
    # -------------------------------
    def calculate_reserve(
        self,
        expected_claims: List[float],
        premium: float,
        rate: float
    ) -> Dict:
        """
        Reserve = PV(Expected Claims) - PV(Premiums)
        """
        pv_claims = self.present_value(expected_claims, rate)

        # Assume premium paid yearly
        premium_stream = [premium] * len(expected_claims)
        pv_premiums = self.present_value(premium_stream, rate)

        reserve = pv_claims - pv_premiums

        return {
            "pv_claims": pv_claims,
            "pv_premiums": pv_premiums,
            "reserve": round(reserve, 6)
        }

    # -------------------------------
    # Cash Flow Projection
    # -------------------------------
    def project_cash_flows(
        self,
        claims: List[float],
        premiums: List[float]
    ) -> List[Dict]:
        """
        Projects net cash flow over time
        """
        result = []

        for t in range(len(claims)):
            net = premiums[t] - claims[t]

            result.append({
                "period": t + 1,
                "premium": premiums[t],
                "claim": claims[t],
                "net_cash_flow": net
            })

        return result

    # -------------------------------
    # Full Reserve Analysis
    # -------------------------------
    def analyze(
        self,
        expected_claims: List[float],
        premium: float,
        rate: float
    ) -> Dict:
        """
        Full reserving pipeline
        """
        reserve_data = self.calculate_reserve(expected_claims, premium, rate)

        premium_stream = [premium] * len(expected_claims)

        cash_flows = self.project_cash_flows(expected_claims, premium_stream)

        return {
            "reserve": reserve_data["reserve"],
            "pv_claims": reserve_data["pv_claims"],
            "pv_premiums": reserve_data["pv_premiums"],
            "cash_flows": cash_flows
        }