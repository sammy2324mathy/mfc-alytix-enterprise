from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.empty import EmptyOperator

default_args = {
    'owner': 'mfc-alytix',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=15),
}

with DAG(
    'mfc_actuarial_etl_pipeline',
    default_args=default_args,
    description='Data pipeline for processing policy attributes and calculating reserves',
    schedule_interval='0 3 * * *', # Run daily at 3:00 AM
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['actuarial', 'insurance', 'reserving'],
) as dag:

    start_task = EmptyOperator(task_id='start_actuarial_etl')

    def ingest_policy_data(**kwargs):
        print("Ingesting active policies, claims history, and premium data...")
        # TODO: Fetch big data from internal administration systems
        return "policy_data_ingested"

    ingest_policy_task = PythonOperator(
        task_id='ingest_policy_data',
        python_callable=ingest_policy_data,
    )

    def process_mortality_tables(**kwargs):
        print("Updating and processing mortality/morbidity probability tables...")
        # TODO: Apply standard tables (e.g., CSO) and internal experience studies
        return "mortality_tables_processed"

    mortality_task = PythonOperator(
        task_id='process_mortality_tables',
        python_callable=process_mortality_tables,
    )

    def calculate_reserves(**kwargs):
        print("Calculating statutory and GAAP reserves for all active blocks...")
        # TODO: Run actuarial valuation models (cash flow projections)
        return "reserves_calculated"

    reserves_task = PythonOperator(
        task_id='calculate_reserves',
        python_callable=calculate_reserves,
    )

    def export_to_marts(**kwargs):
        print("Exporting reserve requirements and survival metrics to Actuarial Data Marts...")
        # TODO: Load final numbers to be consumed by the Actuarial Service frontend
        return "data_marts_updated"

    export_task = PythonOperator(
        task_id='export_to_actuarial_marts',
        python_callable=export_to_marts,
    )

    end_task = EmptyOperator(task_id='end_actuarial_etl')

    # Define Workflow Execution Order
    start_task >> ingest_policy_task >> mortality_task >> reserves_task >> export_task >> end_task
