from typing import List, Dict
import numpy as np


class DrawdownCalculator:
    """
    Provides drawdown-related risk metrics:
    - Maximum Drawdown (MDD)
    - Drawdown series
    - Recovery time
    """

    @staticmethod
    def cumulative_returns(returns: List[float]) -> np.ndarray:
        """
        Convert returns into cumulative return series
        """
        returns_array = np.array(returns)
        return np.cumprod(1 + returns_array)

    @staticmethod
    def drawdown_series(returns: List[float]) -> np.ndarray:
        """
        Compute drawdown at each time step
        """
        cumulative = DrawdownCalculator.cumulative_returns(returns)
        peak = np.maximum.accumulate(cumulative)
        drawdown = (cumulative - peak) / peak
        return drawdown

    @staticmethod
    def max_drawdown(returns: List[float]) -> float:
        """
        Maximum drawdown (worst peak-to-trough decline)
        """
        dd = DrawdownCalculator.drawdown_series(returns)
        return float(np.min(dd))

    @staticmethod
    def drawdown_duration(returns: List[float]) -> int:
        """
        Longest drawdown duration (number of periods underwater)
        """
        dd = DrawdownCalculator.drawdown_series(returns)

        duration = 0
        max_duration = 0

        for value in dd:
            if value < 0:
                duration += 1
                max_duration = max(max_duration, duration)
            else:
                duration = 0

        return max_duration

    @staticmethod
    def recovery_time(returns: List[float]) -> int:
        """
        Time taken to recover from maximum drawdown
        """
        cumulative = DrawdownCalculator.cumulative_returns(returns)
        peak = np.maximum.accumulate(cumulative)
        dd = (cumulative - peak) / peak

        trough_index = int(np.argmin(dd))
        peak_value = peak[trough_index]

        # find recovery point
        for i in range(trough_index, len(cumulative)):
            if cumulative[i] >= peak_value:
                return i - trough_index

        return -1  # not yet recovered

    @staticmethod
    def summary(returns: List[float]) -> Dict:
        """
        Full drawdown report
        """
        return {
            "max_drawdown": DrawdownCalculator.max_drawdown(returns),
            "drawdown_duration": DrawdownCalculator.drawdown_duration(returns),
            "recovery_time": DrawdownCalculator.recovery_time(returns),
        }