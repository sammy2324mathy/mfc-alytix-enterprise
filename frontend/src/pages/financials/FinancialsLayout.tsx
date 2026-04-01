import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  FINANCE_NAV_GROUPS,
  userHasFinanceAccess,
} from '../../config/financeHierarchy';
import {
  BookOpen,
  FileSpreadsheet,
  Users,
  Truck,
  Landmark,
  Package,
  Wallet,
  Receipt,
  FileBarChart,
  TrendingUp,
  Lock,
  ChevronRight,
  Database,
  Activity,
  ShoppingBag,
  Layers,
  Calendar,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  '/accounting/ledger': <BookOpen className="w-4 h-4" />,
  '/accounting/transactions': <FileSpreadsheet className="w-4 h-4" />,
  '/accounting/ar': <Users className="w-4 h-4" />,
  '/accounting/ap': <Truck className="w-4 h-4" />,
  '/accounting/cash': <Landmark className="w-4 h-4" />,
  '/accounting/inventory': <Package className="w-4 h-4" />,
  '/accounting/manufacturing': <Activity className="w-4 h-4" />,
  '/accounting/procurement': <ShoppingBag className="w-4 h-4" />,
  '/accounting/assets': <Layers className="w-4 h-4" />,
  '/accounting/payroll': <Wallet className="w-4 h-4" />,
  '/accounting/projects': <Calendar className="w-4 h-4" />,
  '/accounting/tax': <Receipt className="w-4 h-4" />,
  '/accounting/reports': <FileBarChart className="w-4 h-4" />,
  '/accounting/consolidation': <Database className="w-4 h-4" />,
  '/accounting/decisions': <TrendingUp className="w-4 h-4" />,
};

/* Routes that show the inner finance sidebar when active */
const CORE_FINANCE_PATHS = [
  '/accounting/ledger',
  '/accounting/transactions',
  '/accounting/ar',
  '/accounting/ap',
  '/accounting/cash',
  '/accounting/tax',
  '/accounting/reports',
  '/accounting/consolidation',
  '/accounting/decisions',
];

export const FinancialsLayout: React.FC = () => {
  const location = useLocation();
  const roles = useAuthStore((s) => s.user?.roles);
  const isAdmin = roles?.includes('admin');

  /* Only show inner sidebar for core finance routes */
  const showInnerSidebar = CORE_FINANCE_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  );

  return (
    <div className="flex h-full gap-0 -m-6 md:-m-8">
      {/* Finance Sidebar — only visible on core finance pages */}
      {showInnerSidebar && (
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Finance & Accounting</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isAdmin
                ? 'Administrator — full override'
                : roles?.includes('chief_accountant')
                ? 'Chief Accountant — governance'
                : 'Junior Accountant — operational'}
            </p>
          </div>

          {/* Book Groups */}
          <nav className="flex-1 py-3">
            {FINANCE_NAV_GROUPS.map((group) => {
              const visibleItems = group.items.filter((item) =>
                userHasFinanceAccess(roles, item.access)
              );
              if (visibleItems.length === 0) return null;

              return (
                <div key={group.id} className="mb-1">
                  <div className="px-5 pt-4 pb-1.5">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</h3>
                  </div>
                  <ul className="space-y-0.5 px-2">
                    {visibleItems.map((item) => {
                      const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                      return (
                        <li key={item.href}>
                          <NavLink
                            to={item.href}
                            title={item.erpContext}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group
                              ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                              }
                            `}
                          >
                            <span className={`shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                              {iconMap[item.href] || <BookOpen className="w-4 h-4" />}
                            </span>
                            <span className="flex-1 truncate">{item.name}</span>
                            {item.access === 'chief_only' && (
                              <Lock className="w-3 h-3 text-amber-500 shrink-0" />
                            )}
                            {isActive && (
                              <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="text-[10px] text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Current period: <span className="font-semibold text-slate-500">FY2025 Q4</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Period close: <span className="font-semibold text-slate-500">Open</span></span>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area — full width when inner sidebar is hidden */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30">
        <Outlet />
      </div>
    </div>
  );
};
