import numpy as np
from scipy.stats import norm

class RiskMetrics:
    @staticmethod
    def parametric_var(portfolio_value: float, weights: np.ndarray, cov_matrix: np.ndarray, confidence_level: float, time_horizon: int) -> float:
        """
        Parametric (Variance-Covariance) Value at Risk.
        Assumes normal distribution of returns.
        """
        port_variance = np.dot(weights.T, np.dot(cov_matrix, weights))
        port_volatility = np.sqrt(port_variance)
        
        z_score = norm.ppf(confidence_level)
        var = portfolio_value * z_score * port_volatility * np.sqrt(time_horizon)
        return float(var)

    @staticmethod
    def historical_var(portfolio_value: float, historical_returns: np.ndarray, confidence_level: float, time_horizon: int) -> float:
        """
        Historical Value at Risk based on actual past return quantiles.
        """
        percentile = (1 - confidence_level) * 100
        var_percent = np.percentile(historical_returns, percentile)
        var = -var_percent * portfolio_value * np.sqrt(time_horizon)
        return float(var)

    @staticmethod
    def conditional_var(portfolio_value: float, historical_returns: np.ndarray, confidence_level: float, time_horizon: int) -> float:
        """
        Conditional Value at Risk (Expected Shortfall).
        Takes the average of all losses exceeding the VaR threshold.
        """
        percentile = (1 - confidence_level) * 100
        var_percent = np.percentile(historical_returns, percentile)
        
        tail_returns = historical_returns[historical_returns <= var_percent]
        cvar_percent = np.mean(tail_returns) if len(tail_returns) > 0 else 0
        
        cvar = -cvar_percent * portfolio_value * np.sqrt(time_horizon)
        return float(cvar)
