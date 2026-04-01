from typing import List, Dict
import numpy as np


class SharpeRatioCalculator:
    """
    Sharpe Ratio = (Mean Return - Risk-Free Rate) / Std Dev of Returns

    Measures risk-adjusted return.
    """

    @staticmethod
    def validate_inputs(returns: List[float]):
        if len(returns) < 2:
            raise ValueError("At least two return observations are required.")

    @staticmethod
    def sharpe_ratio(
        returns: List[float],
        risk_free_rate: float = 0.0,
        periods_per_year: int = 252
    ) -> float:
        """
        Calculate annualized Sharpe Ratio
        """
        SharpeRatioCalculator.validate_inputs(returns)

        returns_array = np.array(returns)

        # Excess returns
        excess_returns = returns_array - risk_free_rate

        mean_excess_return = np.mean(excess_returns)
        std_dev = np.std(excess_returns, ddof=1)

        if std_dev == 0:
            return 0.0

        sharpe = (mean_excess_return / std_dev) * np.sqrt(periods_per_year)

        return float(sharpe)

    @staticmethod
    def annualized_return(
        returns: List[float],
        periods_per_year: int = 252
    ) -> float:
        """
        Geometric annualized return
        """
        returns_array = np.array(returns)
        cumulative = np.prod(1 + returns_array)
        n_periods = len(returns_array)

        return float(cumulative ** (periods_per_year / n_periods) - 1)

    @staticmethod
    def volatility(
        returns: List[float],
        periods_per_year: int = 252
    ) -> float:
        """
        Annualized volatility
        """
        returns_array = np.array(returns)
        return float(np.std(returns_array, ddof=1) * np.sqrt(periods_per_year))

    @staticmethod
    def summary(
        returns: List[float],
        risk_free_rate: float = 0.0,
        periods_per_year: int = 252
    ) -> Dict:
        """
        Full Sharpe Ratio report
        """
        sharpe = SharpeRatioCalculator.sharpe_ratio(
            returns, risk_free_rate, periods_per_year
        )

        return {
            "sharpe_ratio": sharpe,
            "annualized_return": SharpeRatioCalculator.annualized_return(
                returns, periods_per_year
            ),
            "volatility": SharpeRatioCalculator.volatility(
                returns, periods_per_year
            ),
        }