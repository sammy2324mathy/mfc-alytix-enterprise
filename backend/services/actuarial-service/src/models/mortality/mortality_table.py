from typing import Dict, List


class MortalityTableModel:
    """
    Extended Life Table Model

    Computes:
    - qx: probability of death
    - px: probability of survival
    - lx: survivors
    - dx: deaths
    - Lx: person-years lived
    - Tx: total future years
    - ex: life expectancy
    """

    def __init__(self, qx: Dict[int, float], radix: int = 100000):
        self.qx = qx
        self.radix = radix

        self.px = {}
        self.lx = {}
        self.dx = {}
        self.Lx = {}
        self.Tx = {}
        self.ex = {}

        self._build_table()

    # -------------------------------
    # Build Full Life Table
    # -------------------------------
    def _build_table(self):
        ages = sorted(self.qx.keys())

        # Initial population
        self.lx[ages[0]] = self.radix

        # Step 1: px, lx, dx
        for i, age in enumerate(ages):
            q = self.qx[age]
            self.px[age] = 1 - q

            if i > 0:
                prev_age = ages[i - 1]
                self.lx[age] = self.lx[prev_age] * self.px[prev_age]

            self.dx[age] = self.lx[age] * q

        # Step 2: Lx (approximation)
        for i, age in enumerate(ages):
            if i < len(ages) - 1:
                next_age = ages[i + 1]
                self.Lx[age] = (self.lx[age] + self.lx[next_age]) / 2
            else:
                self.Lx[age] = self.lx[age] / 2  # last age approximation

        # Step 3: Tx (reverse cumulative)
        total = 0
        for age in reversed(ages):
            total += self.Lx[age]
            self.Tx[age] = total

        # Step 4: ex (life expectancy)
        for age in ages:
            self.ex[age] = self.Tx[age] / self.lx[age] if self.lx[age] > 0 else 0

    # -------------------------------
    # Get Life Expectancy
    # -------------------------------
    def life_expectancy(self, age: int) -> float:
        return round(self.ex.get(age, 0), 4)

    # -------------------------------
    # Survival Probability
    # -------------------------------
    def survival_probability(self, age: int, t: int) -> float:
        prob = 1.0

        for i in range(age, age + t):
            if i not in self.px:
                break
            prob *= self.px[i]

        return round(prob, 8)

    # -------------------------------
    # Death Probability
    # -------------------------------
    def death_probability(self, age: int, t: int) -> float:
        return round(1 - self.survival_probability(age, t), 8)

    # -------------------------------
    # Export Full Table
    # -------------------------------
    def to_dict(self) -> List[Dict]:
        return [
            {
                "age": age,
                "qx": self.qx[age],
                "px": self.px[age],
                "lx": round(self.lx[age], 2),
                "dx": round(self.dx[age], 2),
                "Lx": round(self.Lx[age], 2),
                "Tx": round(self.Tx[age], 2),
                "ex": round(self.ex[age], 4),
            }
            for age in sorted(self.qx.keys())
        ]