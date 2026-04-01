from typing import Dict
import numpy as np


class CorrelationCalculator:
    """
    Correlation and covariance utilities for multi-asset portfolios
    """

    @staticmethod
    def validate_input(data: np.ndarray):
        if len(data.shape) != 2:
            raise ValueError("Input data must be 2D (samples x assets)")

        if data.shape[0] < 2:
            raise ValueError("At least two observations are required")

    # -----------------------------
    # CORRELATION MATRIX
    # -----------------------------
    @staticmethod
    def correlation_matrix(data: np.ndarray) -> np.ndarray:
        """
        Pearson correlation matrix
        """
        CorrelationCalculator.validate_input(data)
        return np.corrcoef(data, rowvar=False)

    # -----------------------------
    # COVARIANCE MATRIX
    # -----------------------------
    @staticmethod
    def covariance_matrix(data: np.ndarray) -> np.ndarray:
        """
        Sample covariance matrix
        """
        CorrelationCalculator.validate_input(data)
        return np.cov(data, rowvar=False, ddof=1)

    # -----------------------------
    # CORRELATION → COVARIANCE
    # -----------------------------
    @staticmethod
    def correlation_to_covariance(
        correlation: np.ndarray,
        std_devs: np.ndarray
    ) -> np.ndarray:
        """
        Convert correlation matrix to covariance matrix
        """
        return correlation * np.outer(std_devs, std_devs)

    # -----------------------------
    # COVARIANCE → CORRELATION
    # -----------------------------
    @staticmethod
    def covariance_to_correlation(covariance: np.ndarray) -> np.ndarray:
        """
        Convert covariance matrix to correlation matrix
        """
        std_devs = np.sqrt(np.diag(covariance))
        return covariance / np.outer(std_devs, std_devs)

    # -----------------------------
    # PORTFOLIO VARIANCE
    # -----------------------------
    @staticmethod
    def portfolio_variance(
        weights: np.ndarray,
        covariance: np.ndarray
    ) -> float:
        """
        Portfolio variance: w^T Σ w
        """
        return float(weights.T @ covariance @ weights)

    # -----------------------------
    # PORTFOLIO VOLATILITY
    # -----------------------------
    @staticmethod
    def portfolio_volatility(
        weights: np.ndarray,
        covariance: np.ndarray
    ) -> float:
        """
        Portfolio standard deviation
        """
        variance = CorrelationCalculator.portfolio_variance(
            weights, covariance
        )
        return float(np.sqrt(variance))

    # -----------------------------
    # SUMMARY
    # -----------------------------
    @staticmethod
    def summary(data: np.ndarray) -> Dict:
        """
        Full correlation analysis
        """
        corr = CorrelationCalculator.correlation_matrix(data)
        cov = CorrelationCalculator.covariance_matrix(data)

        return {
            "correlation_matrix": corr.tolist(),
            "covariance_matrix": cov.tolist(),
        }