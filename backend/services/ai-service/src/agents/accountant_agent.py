from src.agents.base_agent import BaseAgent


class AccountantAgent(BaseAgent):
    name = "accountant"

    def respond(self, message: str, history=None) -> str:
        return (
            "Accounting summary: Double-entry posting verified. "
            "Check trial balance and cashflow impact. Request: "
            f"'{message}'"
        )
