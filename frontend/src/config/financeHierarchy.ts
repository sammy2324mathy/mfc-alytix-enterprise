/**
 * Maps the accounting suite to a full-cycle ERP finance-department hierarchy.
 *
 * Junior accountants carry substantive duties across sub-ledgers (AR/AP, cash, inventory, payroll,
 * tax preparation, reporting packs) and draft journals — they are not “read-only” users; certain
 * governance actions (e.g. final posting authority, period close, executive FP&A) stay with the chief.
 * Chief accountants: approval, close, statutory sign-off, and leadership analytics on top of that base.
 */

export type FinanceRole = 'junior_accountant' | 'chief_accountant';

export type NavAccess = 'all_finance' | 'chief_only';

export type FinanceNavItem = {
  name: string;
  href: string;
  /** ERP context label for tooltips and docs */
  erpContext: string;
  access: NavAccess;
};

export type FinanceNavGroup = {
  id: string;
  title: string;
  subtitle: string;
  items: FinanceNavItem[];
};

/** Full accounting cycle: record → sell/buy → treasury → ops → HR → compliance → performance */
export const FINANCE_NAV_GROUPS: FinanceNavGroup[] = [
  {
    id: 'core_finance',
    title: 'Core Finance',
    subtitle: 'General ledger, journals, and batch control',
    items: [
      {
        name: 'General Ledger',
        href: '/accounting/ledger',
        erpContext: 'GL — chart of accounts & trial balance',
        access: 'all_finance',
      },
      {
        name: 'Journals & Batches',
        href: '/accounting/transactions',
        erpContext: 'GL — double-entry batches & approvals',
        access: 'all_finance',
      },
      {
        name: 'Cash & Bank',
        href: '/accounting/cash',
        erpContext: 'Treasury — bank recs & cash positioning',
        access: 'all_finance',
      },
    ],
  },
  {
    id: 'subledgers',
    title: 'Customers & Suppliers',
    subtitle: 'Accounts receivable and accounts payable',
    items: [
      {
        name: 'Accounts Receivable',
        href: '/accounting/ar',
        erpContext: 'AR — invoicing, cash application, aging',
        access: 'all_finance',
      },
      {
        name: 'Accounts Payable',
        href: '/accounting/ap',
        erpContext: 'AP — vendor invoices, approvals, disbursements',
        access: 'all_finance',
      },
    ],
  },
  {
    id: 'tax_reporting',
    title: 'Tax & Statutory Reporting',
    subtitle: 'Returns, provisioning, and filings',
    items: [
      {
        name: 'Taxes',
        href: '/accounting/tax',
        erpContext: 'Tax — VAT/GST, corporate tax, statutory packs',
        access: 'all_finance',
      },
      {
        name: 'Financial Reports',
        href: '/accounting/reports',
        erpContext: 'Financial statements & management packs',
        access: 'all_finance',
      },
    ],
  },
  {
    id: 'performance',
    title: 'Enterprise Performance',
    subtitle: 'Consolidation, FP&A, and executive analytics',
    items: [
      {
        name: 'Group Consolidation',
        href: '/accounting/consolidation',
        erpContext: 'Consolidation — inter-company & group P&L',
        access: 'chief_only',
      },
      {
        name: 'Business Decisions',
        href: '/accounting/decisions',
        erpContext: 'FP&A — variance, forecasting, strategic views',
        access: 'chief_only',
      },
    ],
  },
];

export function userHasFinanceAccess(
  roles: string[] | undefined,
  access: NavAccess
): boolean {
  if (!roles?.length) return false;
  if (roles.includes('admin')) return true;
  const isChief = roles.includes('chief_accountant');
  const isJunior = roles.includes('junior_accountant');
  if (access === 'chief_only') return isChief;
  return isJunior || isChief;
}

export function flattenVisibleNavItems(roles: string[] | undefined): FinanceNavItem[] {
  return FINANCE_NAV_GROUPS.flatMap((g) =>
    g.items.filter((item) => userHasFinanceAccess(roles, item.access))
  );
}
