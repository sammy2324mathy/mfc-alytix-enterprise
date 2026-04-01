import requests
from decimal import Decimal
from typing import Optional
from domain.value_objects import Money


class CurrencyConverter:
    """
    Infrastructure Service: Currency Converter

    - Integrates with external exchange rate APIs
    - Falls back to static/manual rates if API fails
    """

    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key

        # fallback rates (example)
        self.fallback_rates = {
            ("USD", "ZWL"): Decimal("3500"),
            ("ZWL", "USD"): Decimal("0.000285"),
            ("USD", "EUR"): Decimal("0.92"),
            ("EUR", "USD"): Decimal("1.08"),
        }

    # -------------------------------
    # External API Call
    # -------------------------------
    def _get_rate_external(self, from_currency: str, to_currency: str) -> Optional[Decimal]:
        if not self.base_url:
            return None

        try:
            response = requests.get(
                f"{self.base_url}/convert",
                params={
                    "from": from_currency,
                    "to": to_currency,
                    "amount": 1
                },
                headers={"Authorization": f"Bearer {self.api_key}"} if self.api_key else {},
                timeout=5,
            )

            response.raise_for_status()
            data = response.json()

            rate = data.get("rate") or data.get("result")
            return Decimal(str(rate))

        except Exception:
            return None

    # -------------------------------
    # Fallback Rate
    # -------------------------------
    def _get_rate_fallback(self, from_currency: str, to_currency: str) -> Decimal:
        key = (from_currency, to_currency)

        if key not in self.fallback_rates:
            raise ValueError(f"No fallback rate for {from_currency} → {to_currency}")

        return self.fallback_rates[key]

    # -------------------------------
    # Get Rate (Unified)
    # -------------------------------
    def get_rate(self, from_currency: str, to_currency: str) -> Decimal:
        if from_currency == to_currency:
            return Decimal("1")

        # try external first
        rate = self._get_rate_external(from_currency, to_currency)

        if rate:
            return rate

        # fallback
        return self._get_rate_fallback(from_currency, to_currency)

    # -------------------------------
    # Convert Money
    # -------------------------------
    def convert(self, money: Money, to_currency: str) -> Money:
        rate = self.get_rate(money.currency, to_currency)

        converted_amount = money.amount * rate

        return Money(converted_amount, to_currency)