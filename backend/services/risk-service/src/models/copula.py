from typing import List, Dict
import numpy as np
from scipy.stats import norm


class GaussianCopula:
    """
    Gaussian Copula for modeling dependency between assets

    Steps:
    1. Transform returns → uniform (CDF)
    2. Transform uniform → normal space
    3. Apply correlation structure
    4. Simulate joint distribution
    """

    def __init__(self, data: np.ndarray):
        """
        data: shape (n_samples, n_assets)
        """
        if len(data.shape) != 2:
            raise ValueError("Data must be 2D (samples x assets)")

        self.data = data
        self.n_samples, self.n_assets = data.shape

    # -----------------------------
    # STEP 1: Empirical CDF → Uniform
    # -----------------------------
    def to_uniform(self) -> np.ndarray:
        """
        Convert each asset's returns to uniform distribution
        """
        ranks = np.argsort(np.argsort(self.data, axis=0), axis=0)
        uniform = (ranks + 1) / (self.n_samples + 1)
        return uniform

    # -----------------------------
    # STEP 2: Uniform → Normal
    # -----------------------------
    def to_normal(self, uniform_data: np.ndarray) -> np.ndarray:
        """
        Apply inverse CDF (probit transform)
        """
        return norm.ppf(uniform_data)

    # -----------------------------
    # STEP 3: Estimate Correlation
    # -----------------------------
    def correlation_matrix(self, normal_data: np.ndarray) -> np.ndarray:
        """
        Compute correlation matrix
        """
        return np.corrcoef(normal_data, rowvar=False)

    # -----------------------------
    # STEP 4: Simulate
    # -----------------------------
    def simulate(self, n_simulations: int = 10000) -> np.ndarray:
        """
        Generate correlated samples
        """
        uniform = self.to_uniform()
        normal_data = self.to_normal(uniform)

        corr_matrix = self.correlation_matrix(normal_data)

        # Cholesky decomposition
        L = np.linalg.cholesky(corr_matrix)

        # Generate independent normals
        z = np.random.normal(size=(n_simulations, self.n_assets))

        # Apply correlation
        correlated = z @ L.T

        # Convert back to uniform
        simulated_uniform = norm.cdf(correlated)

        return simulated_uniform

    # -----------------------------
    # MAP BACK TO RETURNS
    # -----------------------------
    def inverse_transform(self, simulated_uniform: np.ndarray) -> np.ndarray:
        """
        Map simulated uniform values back to empirical returns
        """
        simulated_returns = np.zeros_like(simulated_uniform)

        for i in range(self.n_assets):
            sorted_returns = np.sort(self.data[:, i])
            indices = (simulated_uniform[:, i] * (self.n_samples - 1)).astype(int)
            simulated_returns[:, i] = sorted_returns[indices]

        return simulated_returns

    # -----------------------------
    # FULL PIPELINE
    # -----------------------------
    def generate_returns(self, n_simulations: int = 10000) -> np.ndarray:
        """
        Full copula-based simulation
        """
        simulated_uniform = self.simulate(n_simulations)
        return self.inverse_transform(simulated_uniform)

    # -----------------------------
    # SUMMARY
    # -----------------------------
    def summary(self, n_simulations: int = 10000) -> Dict:
        """
        Generate simulated portfolio statistics
        """
        simulated_returns = self.generate_returns(n_simulations)

        portfolio_returns = simulated_returns.mean(axis=1)

        return {
            "mean": float(np.mean(portfolio_returns)),
            "std": float(np.std(portfolio_returns)),
            "min": float(np.min(portfolio_returns)),
            "max": float(np.max(portfolio_returns)),
        }