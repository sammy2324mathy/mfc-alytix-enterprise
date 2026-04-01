from typing import Dict, Any, Optional


class ResponseFormatter:
    """
    Standardizes LLM responses across all agents
    """

    # -----------------------------
    # STRUCTURED RESPONSE
    # -----------------------------
    @staticmethod
    def format_response(
        summary: str,
        metrics: Optional[Dict[str, Any]] = None,
        insights: Optional[str] = None,
        recommendations: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Standard response format
        """
        return {
            "summary": summary,
            "metrics": metrics or {},
            "insights": insights or "",
            "recommendations": recommendations or "",
        }

    # -----------------------------
    # ERROR RESPONSE
    # -----------------------------
    @staticmethod
    def error(message: str) -> Dict[str, Any]:
        return {
            "status": "error",
            "message": message,
        }

    # -----------------------------
    # SUCCESS RESPONSE
    # -----------------------------
    @staticmethod
    def success(data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "status": "success",
            "data": data,
        }

    # -----------------------------
    # RAW LLM PARSER
    # -----------------------------
    @staticmethod
    def parse_llm_output(text: str) -> Dict[str, str]:
        """
        Parse structured text output from LLM into sections

        Expected format:
        - Summary
        - Key Metrics
        - Insights
        - Recommendations
        """
        sections = {
            "summary": "",
            "metrics": "",
            "insights": "",
            "recommendations": "",
        }

        current_section = None

        for line in text.split("\n"):
            line_lower = line.lower()

            if "summary" in line_lower:
                current_section = "summary"
                continue
            elif "metric" in line_lower:
                current_section = "metrics"
                continue
            elif "insight" in line_lower:
                current_section = "insights"
                continue
            elif "recommendation" in line_lower:
                current_section = "recommendations"
                continue

            if current_section:
                sections[current_section] += line.strip() + " "

        return {k: v.strip() for k, v in sections.items()}

    # -----------------------------
    # FULL PIPELINE FORMATTER
    # -----------------------------
    @staticmethod
    def build_from_llm(text: str) -> Dict[str, Any]:
        """
        Convert raw LLM output → structured API response
        """
        parsed = ResponseFormatter.parse_llm_output(text)

        return ResponseFormatter.success(
            ResponseFormatter.format_response(
                summary=parsed["summary"],
                metrics={"raw": parsed["metrics"]},
                insights=parsed["insights"],
                recommendations=parsed["recommendations"],
            )
        )