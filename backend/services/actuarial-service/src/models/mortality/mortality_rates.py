from typing import Dict, List


class MortalityTable:
    """
    Life Table Model

    Defines:
    - qx: probability of death
    - px: probability of survival
    - lx: number of survivors
    - dx: number of deaths
    """

    def __init__(self, qx: Dict[int, float], radix: int = 100000):
        """
        qx: {age: mortality rate}
        radix: initial population (l0)
        """
        self.qx = qx
        self.radix = radix

        self.px = {}
        self.lx = {}
        self.dx = {}

        self._build_table()

    # -------------------------------
    # Build Life Table
    # -------------------------------
    def _build_table(self):
        """
        Compute px, lx, dx from qx
        """
        ages = sorted(self.qx.keys())

        self.lx[ages[0]] = self.radix

        for i, age in enumerate(ages):
            q = self.qx[age]
            self.px[age] = 1 - q

            if i > 0:
                prev_age = ages[i - 1]
                self.lx[age] = self.lx[prev_age] * self.px[prev_age]

            self.dx[age] = self.lx[age] * q

    # -------------------------------
    # Get Survival Probability
    # -------------------------------
    def survival_probability(self, age: int, t: int) -> float:
        """
        Probability of surviving t years from age x
        """
        prob = 1.0

        for i in range(age, age + t):
            if i not in self.px:
                break
            prob *= self.px[i]

        return round(prob, 8)

    # -------------------------------
    # Get Death Probability
    # -------------------------------
    def death_probability(self, age: int, t: int) -> float:
        """
        Probability of dying within t years
        """
        return round(1 - self.survival_probability(age, t), 8)

    # -------------------------------
    # Life Expectancy (approx)
    # -------------------------------
    def life_expectancy(self, age: int) -> float:
        """
        Approximate life expectancy
        """
        expected_years = 0.0

        for t in range(1, 121 - age):  # up to age 120
            expected_years += self.survival_probability(age, t)

        return round(expected_years, 4)

    # -------------------------------
    # Extract Table Snapshot
    # -------------------------------
    def to_dict(self) -> List[Dict]:
        """
        Export life table
        """
        return [
            {
                "age": age,
                "qx": self.qx[age],
                "px": self.px[age],
                "lx": round(self.lx[age], 2),
                "dx": round(self.dx[age], 2),
            }
            for age in sorted(self.qx.keys())
        ]