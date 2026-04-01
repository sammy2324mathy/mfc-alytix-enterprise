from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class DateRange:
    """
    Value Object: DateRange

    Represents a time interval with validation and utility methods.
    Immutable and safe for use across domain logic.
    """

    start_date: datetime
    end_date: datetime

    def __post_init__(self):
        if not isinstance(self.start_date, datetime) or not isinstance(self.end_date, datetime):
            raise ValueError("start_date and end_date must be datetime objects")

        if self.start_date > self.end_date:
            raise ValueError("start_date cannot be after end_date")

    # -------------------------------
    # Check if a date is within range
    # -------------------------------
    def contains(self, date: datetime) -> bool:
        return self.start_date <= date <= self.end_date

    # -------------------------------
    # Check overlap with another range
    # -------------------------------
    def overlaps(self, other: "DateRange") -> bool:
        return self.start_date <= other.end_date and self.end_date >= other.start_date

    # -------------------------------
    # Duration in days
    # -------------------------------
    def duration_days(self) -> int:
        return (self.end_date - self.start_date).days

    # -------------------------------
    # Check if range is active now
    # -------------------------------
    def is_active(self) -> bool:
        now = datetime.utcnow()
        return self.contains(now)

    # -------------------------------
    # Serialize
    # -------------------------------
    def to_dict(self):
        return {
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "duration_days": self.duration_days()
        }

    # -------------------------------
    # String representation
    # -------------------------------
    def __str__(self):
        return f"{self.start_date.isoformat()} → {self.end_date.isoformat()}"