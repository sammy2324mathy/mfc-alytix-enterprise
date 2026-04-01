import httpx

def get_stock_price(ticker: str) -> str:
    """Mock implementation of getting stock price."""
    return f"The current price of {ticker} is $150.00 (Mocked)"

def get_market_news(query: str) -> str:
    """Mock implementation of getting market news."""
    return f"Latest news for {query}: Markets are showing steady growth. (Mocked)"

def get_forecast(metric: str = "revenue", horizon_months: int = 6, model_type: str = "linear") -> str:
    """Get a financial forecast from the data science service."""
    try:
        url = "http://data-science-service:8009/ds/predict/forecast"
        payload = {
            "metric": metric,
            "horizon_months": horizon_months,
            "model_type": model_type,
            "confidence_level": 0.95
        }
        with httpx.Client(timeout=10.0) as client:
            response = client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            
            forecast_values = data.get("forecast", [])
            avg_val = sum(forecast_values) / len(forecast_values) if forecast_values else 0
            
            return f"Forecast for {metric} ({model_type} model, {horizon_months} months): Average value approx ${avg_val:,.2f}. Full series: {forecast_values[:3]}..."
    except Exception as e:
        return f"Error fetching forecast: {str(e)}"

def get_customers() -> str:
    """Fetch all customer data from the accounting service."""
    try:
        url = "http://accounting-service:8002/accounting/ar/customers"
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)
            response.raise_for_status()
            customers = response.json()
            if not customers:
                return "No customers found in the system."
            
            lines = [f"{c['name']} ({c['code']}): Balance ${c['balance']:,.2f}" for c in customers]
            return "Active Enterprise Customers:\n" + "\n".join(lines)
    except Exception as e:
        return f"Error retrieving customers: {str(e)}"

def get_fixed_assets() -> str:
    """Fetch all fixed asset data from the accounting service."""
    try:
        url = "http://accounting-service:8002/accounting/fixed-assets"
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)
            response.raise_for_status()
            assets = response.json()
            if not assets:
                return "No fixed assets found in the inventory."
            
            lines = [f"{a['asset_name']} ({a['asset_tag']}): Book Value ${a['current_book_value']:,.2f}" for a in assets]
            return "Registered Industrial Assets:\n" + "\n".join(lines)
    except Exception as e:
        return f"Error retrieving fixed assets: {str(e)}"

finance_functions = {
    "get_stock_price": get_stock_price,
    "get_market_news": get_market_news,
    "get_forecast": get_forecast,
    "get_customers": get_customers,
    "get_fixed_assets": get_fixed_assets
}

finance_tools_schema = [
    {
        "type": "function",
        "function": {
            "name": "get_stock_price",
            "description": "Get the current stock price for a given ticker symbol",
            "parameters": {
                "type": "object",
                "properties": {
                    "ticker": {"type": "string", "description": "The stock ticker symbol, e.g. AAPL"}
                },
                "required": ["ticker"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_market_news",
            "description": "Retrieve the latest news for a specific financial topic or company",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The topic or company to search news for"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_customers",
            "description": "Retrieve a complete list of all enterprise customers and their current balances"
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_fixed_assets",
            "description": "Retrieve a complete inventory of industrial fixed assets and their current book values"
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_forecast",
            "description": "Generate a financial forecast for a specific metric (e.g., revenue) using predictive models",
            "parameters": {
                "type": "object",
                "properties": {
                    "metric": {"type": "string", "description": "The financial metric to forecast"},
                    "horizon_months": {"type": "integer", "description": "Forecast duration in months"},
                    "model_type": {"type": "string", "enum": ["linear", "arima", "lstm"], "description": "The predictive model architecture"}
                },
                "required": ["metric"]
            }
        }
    }
]
