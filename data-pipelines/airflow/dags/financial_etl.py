from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.empty import EmptyOperator

default_args = {
    'owner': 'mfc-alytix',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'mfc_financial_etl_pipeline',
    default_args=default_args,
    description='ETL pipeline for reconciling transactions and generating consolidated financials',
    schedule_interval='0 1 * * *', # Run daily at 1:00 AM
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['finance', 'accounting', 'etl'],
) as dag:

    start_task = EmptyOperator(task_id='start_financial_etl')

    def extract_ledger_data(**kwargs):
        print("Extracting raw transaction logs and sub-ledger entries...")
        # TODO: Extract data from accounting microservices databases
        return "ledger_extracted"

    extract_ledger_task = PythonOperator(
        task_id='extract_ledger_data',
        python_callable=extract_ledger_data,
    )

    def reconcile_transactions(**kwargs):
        print("Running daily transaction reconciliation algorithms...")
        # TODO: Match transactions and flag anomalies/discrepancies
        return "transactions_reconciled"

    reconcile_task = PythonOperator(
        task_id='reconcile_transactions',
        python_callable=reconcile_transactions,
    )

    def generate_consolidated_statements(**kwargs):
        print("Aggregating trial balance into Income Statement and Balance Sheet formats...")
        # TODO: Execute aggregation queries and currency conversions
        return "statements_generated"

    statements_task = PythonOperator(
        task_id='generate_consolidated_statements',
        python_callable=generate_consolidated_statements,
    )

    def load_to_data_warehouse(**kwargs):
        print("Loading clean financial data into the Enterprise Data Warehouse...")
        # TODO: Upsert operations into Snowflake/Redshift/PostgreSQL DW
        return "data_loaded_to_warehouse"

    load_dw_task = PythonOperator(
        task_id='load_to_data_warehouse',
        python_callable=load_to_data_warehouse,
    )

    end_task = EmptyOperator(task_id='end_financial_etl')

    # Define Workflow Execution Order
    start_task >> extract_ledger_task >> reconcile_task >> statements_task >> load_dw_task >> end_task
