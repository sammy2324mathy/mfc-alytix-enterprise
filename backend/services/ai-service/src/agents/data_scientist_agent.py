from typing import Dict, Any, List
import pandas as pd
import numpy as np


class DataScientistAgent:
    """
    AI Agent: Data Scientist

    Capabilities:
    - Data analysis
    - Feature engineering
    - Basic ML recommendations
    - Insight generation
    """

    def __init__(self, name: str = "DataScientistAgent"):
        self.name = name

    # -------------------------------
    # Load Dataset
    # -------------------------------
    def load_data(self, data: List[Dict]) -> pd.DataFrame:
        return pd.DataFrame(data)

    # -------------------------------
    # Basic Data Summary
    # -------------------------------
    def summarize(self, df: pd.DataFrame) -> Dict[str, Any]:
        return {
            "shape": df.shape,
            "columns": list(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "dtypes": df.dtypes.astype(str).to_dict(),
        }

    # -------------------------------
    # Statistical Description
    # -------------------------------
    def describe(self, df: pd.DataFrame) -> Dict[str, Any]:
        return df.describe(include="all").to_dict()

    # -------------------------------
    # Feature Engineering Suggestions
    # -------------------------------
    def suggest_features(self, df: pd.DataFrame) -> List[str]:
        suggestions = []

        for col in df.columns:
            if df[col].dtype == "object":
                suggestions.append(f"Encode categorical column: {col}")
            elif np.issubdtype(df[col].dtype, np.number):
                suggestions.append(f"Normalize/scale numeric column: {col}")

        return suggestions

    # -------------------------------
    # Correlation Analysis
    # -------------------------------
    def correlation_analysis(self, df: pd.DataFrame) -> Dict:
        numeric_df = df.select_dtypes(include=[np.number])

        if numeric_df.empty:
            return {}

        corr = numeric_df.corr()

        return corr.to_dict()

    # -------------------------------
    # Model Recommendation
    # -------------------------------
    def recommend_model(self, df: pd.DataFrame, target: str) -> str:
        if target not in df.columns:
            raise ValueError("Target column not found")

        if df[target].dtype == "object":
            return "Classification (Logistic Regression, Random Forest, XGBoost)"
        else:
            return "Regression (Linear Regression, Random Forest Regressor, XGBoost)"

    # -------------------------------
    # Simple Training (Baseline)
    # -------------------------------
    def train_baseline(self, df: pd.DataFrame, target: str) -> Dict:
        from sklearn.model_selection import train_test_split
        from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
        from sklearn.metrics import accuracy_score, mean_squared_error

        df = df.dropna()

        X = df.drop(columns=[target])
        y = df[target]

        # Convert categorical to numeric
        X = pd.get_dummies(X)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        if y.dtype == "object":
            model = RandomForestClassifier()
            model.fit(X_train, y_train)
            preds = model.predict(X_test)

            return {
                "type": "classification",
                "accuracy": accuracy_score(y_test, preds),
            }
        else:
            model = RandomForestRegressor()
            model.fit(X_train, y_train)
            preds = model.predict(X_test)

            return {
                "type": "regression",
                "mse": mean_squared_error(y_test, preds),
            }

    # -------------------------------
    # Insight Generator
    # -------------------------------
    def generate_insights(self, df: pd.DataFrame) -> List[str]:
        insights = []

        if df.isnull().sum().sum() > 0:
            insights.append("Dataset contains missing values")

        numeric_cols = df.select_dtypes(include=[np.number]).columns

        for col in numeric_cols:
            if df[col].std() == 0:
                insights.append(f"{col} has no variance")

        insights.append(f"Dataset has {df.shape[0]} rows and {df.shape[1]} columns")

        return insights