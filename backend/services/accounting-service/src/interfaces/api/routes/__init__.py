from fastapi import APIRouter

from . import (
    accounts, transactions, reports, ap, ar, bank, inventory, procurement, 
    manufacturing, fixed_assets, payroll, projects, tax, scm, consolidation,
    budgeting, cost_accounting, period_close, autopilot, journal_proposals,
    integrations, payments, insurance, treasury,
)

router = APIRouter()
router.include_router(accounts.router, prefix="/accounts", tags=["accounts"])
router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
router.include_router(reports.router, prefix="/reports", tags=["reports"])
router.include_router(ap.router, prefix="/ap", tags=["ap"])
router.include_router(ar.router, prefix="/ar", tags=["ar"])
router.include_router(bank.router, prefix="/bank", tags=["bank"])
router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
router.include_router(procurement.router, prefix="/procurement", tags=["procurement"])
router.include_router(manufacturing.router, prefix="/manufacturing", tags=["manufacturing"])
router.include_router(fixed_assets.router, prefix="/fixed-assets", tags=["fixed-assets"])
router.include_router(payroll.router, prefix="/payroll", tags=["payroll"])
router.include_router(projects.router, prefix="/projects", tags=["projects"])
router.include_router(tax.router, prefix="/tax", tags=["tax"])
router.include_router(scm.router, prefix="/scm", tags=["scm"])
router.include_router(consolidation.router, prefix="/consolidation", tags=["consolidation"])
router.include_router(budgeting.router, prefix="/budgeting", tags=["budgeting"])
router.include_router(cost_accounting.router, prefix="/cost-accounting", tags=["cost-accounting"])
router.include_router(period_close.router, prefix="/period", tags=["period-close"])
router.include_router(autopilot.router, prefix="/autopilot", tags=["autopilot"])
router.include_router(journal_proposals.router, prefix="/journal-proposals", tags=["journal-proposals"])
router.include_router(integrations.router, prefix="/integrations", tags=["integrations"])
router.include_router(payments.router, prefix="/payments", tags=["payments"])
router.include_router(insurance.router, prefix="/insurance", tags=["insurance"])
router.include_router(treasury.router, prefix="/treasury", tags=["treasury"])
