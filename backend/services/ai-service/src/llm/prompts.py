from typing import Dict


class PromptTemplates:
    """
    Centralized prompt templates for all AI agents
    """

    # -----------------------------
    # SYSTEM PROMPTS
    # -----------------------------
    SYSTEM_PROMPTS: Dict[str, str] = {
        "risk_agent": (
            "You are a quantitative risk analyst. "
            "Analyze financial data, compute risk metrics such as VaR, Expected Shortfall, "
            "drawdowns, and provide professional risk insights."
        ),
        "actuarial_agent": (
            "You are an actuarial scientist. "
            "Work with survival models, claims modeling, pricing, and reserving. "
            "Provide statistically sound actuarial insights."
        ),
        "compliance_agent": (
            "You are a financial compliance expert. "
            "Ensure regulatory alignment (Basel III, IFRS, AML). "
            "Identify risks, violations, and compliance gaps."
        ),
        "data_scientist_agent": (
            "You are a senior data scientist. "
            "Analyze datasets, build models, and explain insights clearly. "
            "Focus on predictive modeling and statistical reasoning."
        ),
    }

    # -----------------------------
    # TASK PROMPTS
    # -----------------------------
    TASK_PROMPTS: Dict[str, str] = {
        "risk_analysis": (
            "Given the following returns data:\n{data}\n"
            "1. Calculate key risk metrics (VaR, ES, volatility)\n"
            "2. Interpret the risk profile\n"
            "3. Provide actionable insights"
        ),
        "portfolio_analysis": (
            "Analyze this portfolio data:\n{data}\n"
            "1. Evaluate diversification and correlation\n"
            "2. Assess risk exposure\n"
            "3. Suggest optimization strategies"
        ),
        "stress_test": (
            "Given the scenario:\n{scenario}\n"
            "And data:\n{data}\n"
            "1. Evaluate impact on portfolio\n"
            "2. Identify vulnerabilities\n"
            "3. Recommend mitigation strategies"
        ),
        "forecasting": (
            "Using the following time series:\n{data}\n"
            "1. Identify trends and seasonality\n"
            "2. Suggest forecasting approach\n"
            "3. Provide predictions with explanation"
        ),
    }

    # -----------------------------
    # RESPONSE FORMAT
    # -----------------------------
    RESPONSE_FORMAT = (
        "Respond in a structured format:\n"
        "- Summary\n"
        "- Key Metrics\n"
        "- Insights\n"
        "- Recommendations"
    )

    # -----------------------------
    # GENERATOR FUNCTION
    # -----------------------------
    @staticmethod
    def build_prompt(
        agent_type: str,
        task_type: str,
        data: str,
        extra_context: str = ""
    ) -> str:
        """
        Build full prompt dynamically
        """
        system_prompt = PromptTemplates.SYSTEM_PROMPTS.get(
            agent_type,
            "You are an AI assistant."
        )

        task_prompt = PromptTemplates.TASK_PROMPTS.get(
            task_type,
            "Analyze the following data:\n{data}"
        )

        task_filled = task_prompt.format(data=data, scenario=extra_context)

        full_prompt = (
            f"{system_prompt}\n\n"
            f"{task_filled}\n\n"
            f"{PromptTemplates.RESPONSE_FORMAT}"
        )

        return full_prompt