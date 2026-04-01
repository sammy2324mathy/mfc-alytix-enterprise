class GenerateReportUseCase:
    def __init__(self, ledger_repo):
        self.ledger_repo = ledger_repo

    def execute(self, report_type: str, start_date=None, end_date=None):
        if report_type == "trial_balance":
            return self.ledger_repo.get_trial_balance(start_date, end_date)

        elif report_type == "income_statement":
            return self.ledger_repo.get_income_statement(start_date, end_date)

        elif report_type == "balance_sheet":
            return self.ledger_repo.get_balance_sheet(end_date)

        else:
            raise ValueError(f"Unsupported report type: {report_type}")