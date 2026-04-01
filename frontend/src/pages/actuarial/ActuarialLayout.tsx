import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Activity,
  BarChart3,
  Calculator,
  ChevronRight,
  Database,
  FileSpreadsheet,
  FlaskConical,
  Heart,
  LineChart,
  Lock,
  PieChart,
  Shield,
  TrendingUp,
} from 'lucide-react';

type NavAccess = 'all' | 'chief_only';

interface ActuarialNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  access: NavAccess;
}

interface ActuarialNavGroup {
  id: string;
  title: string;
  items: ActuarialNavItem[];
}

const ACTUARIAL_NAV: ActuarialNavGroup[] = [
  {
    id: 'risk-analysis',
    title: 'Risk Analysis',
    items: [
      { name: 'Mortality Tables', href: '/actuarial/mortality', icon: <Heart className="w-4 h-4" />, description: 'Life tables, qx curves, and experience studies', access: 'all' },
      { name: 'Survival Models', href: '/actuarial/survival', icon: <Activity className="w-4 h-4" />, description: 'Kaplan-Meier, Cox PH, and Weibull models', access: 'all' },
    ],
  },
  {
    id: 'pricing-reserves',
    title: 'Pricing & Reserves',
    items: [
      { name: 'Product Pricing', href: '/actuarial/pricing', icon: <Calculator className="w-4 h-4" />, description: 'Rate proposals, premium computation, CUV', access: 'all' },
      { name: 'Claims Reserving', href: '/actuarial/claims', icon: <Shield className="w-4 h-4" />, description: 'IBNR, loss triangles, Chain Ladder', access: 'all' },
    ],
  },
  {
    id: 'modeling',
    title: 'Modeling & Projections',
    items: [
      { name: 'Cash Flow Modeler', href: '/actuarial/modeler', icon: <FileSpreadsheet className="w-4 h-4" />, description: 'Policy values, liability projections, scenario testing', access: 'all' },
      { name: 'Simulation Lab', href: '/actuarial/simulations', icon: <FlaskConical className="w-4 h-4" />, description: 'Monte Carlo engine and stochastic forecasting', access: 'all' },
    ],
  },
  {
    id: 'data-reporting',
    title: 'Data & Reporting',
    items: [
      { name: 'Data Explorer', href: '/actuarial/data', icon: <Database className="w-4 h-4" />, description: 'Policyholder, claims, and exposure datasets', access: 'all' },
      { name: 'Actuarial Dashboards', href: '/actuarial/dashboards', icon: <PieChart className="w-4 h-4" />, description: 'KPIs, profitability, loss ratios', access: 'all' },
    ],
  },
  {
    id: 'governance',
    title: 'Governance',
    items: [
      { name: 'Assumptions Register', href: '/actuarial/assumptions', icon: <BarChart3 className="w-4 h-4" />, description: 'Rate basis, best-estimate assumptions, sign-off', access: 'chief_only' },
    ],
  },
];

export const ActuarialLayout: React.FC = () => {
  const location = useLocation();
  const roles = useAuthStore((s) => s.user?.roles);
  const isAdmin = roles?.includes('admin');
  const isChief = roles?.includes('chief_actuary') || isAdmin;

  return (
    <div className="flex h-full gap-0 -m-6 md:-m-8">
      {/* Actuarial Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Actuarial Science</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isChief ? 'Chief Actuary — governance authority' : 'Actuarial Analyst — modeling & analysis'}
          </p>
        </div>

        <nav className="flex-1 py-3">
          {ACTUARIAL_NAV.map((group) => {
            const visible = group.items.filter(item => item.access === 'all' || isChief);
            if (!visible.length) return null;

            return (
              <div key={group.id} className="mb-1">
                <div className="px-5 pt-4 pb-1.5">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</h3>
                </div>
                <ul className="space-y-0.5 px-2">
                  {visible.map((item) => {
                    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                    return (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          title={item.description}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group
                            ${isActive
                              ? 'bg-indigo-50 text-indigo-800 shadow-sm border border-indigo-100'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                            }
                          `}
                        >
                          <span className={`shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate">{item.name}</span>
                          {item.access === 'chief_only' && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Valuation date: <span className="font-semibold text-slate-500">31 Dec 2025</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Basis: <span className="font-semibold text-slate-500">Best Estimate</span></span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30">
        <Outlet />
      </div>
    </div>
  );
};
