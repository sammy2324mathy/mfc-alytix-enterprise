import numpy as np

class MonteCarloEngine:
    @staticmethod
    def simulate_gbm(portfolio_value: float, mu: float, sigma: float, time_horizon: int, num_simulations: int, dt: float = 1.0) -> np.ndarray:
        """
        Simulates Geometric Brownian Motion returns.
        mu: expected return
        sigma: volatility
        dt: time step
        """
        Z = np.random.standard_normal((time_horizon, num_simulations))
        daily_returns = np.exp((mu - 0.5 * sigma ** 2) * dt + sigma * np.sqrt(dt) * Z)
        
        price_paths = np.zeros_like(daily_returns)
        price_paths[0] = portfolio_value
        
        for t in range(1, time_horizon):
            price_paths[t] = price_paths[t-1] * daily_returns[t]
            
        return price_paths