import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  BarChart3,
  ChevronRight,
  Flame,
  Gauge,
  Lock,
  ShieldCheck,
  Target,
  TrendingDown,
  Waves,
} from 'lucide-react';

interface RiskNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  croOnly?: boolean;
}

interface RiskNavGroup {
  id: string;
  title: string;
  items: RiskNavItem[];
}

const RISK_NAV: RiskNavGroup[] = [
  {
    id: 'measurement',
    title: 'Risk Measurement',
    items: [
      { name: 'VaR & Metrics', href: '/risk/metrics', icon: <Gauge className="w-4 h-4" />, description: 'Value at Risk, capital adequacy, limit governance' },
      { name: 'Monte Carlo Lab', href: '/risk/simulations', icon: <Waves className="w-4 h-4" />, description: 'Stochastic simulations and path generation' },
    ],
  },
  {
    id: 'scenarios',
    title: 'Scenario Analysis',
    items: [
      { name: 'Stress Tests', href: '/risk/stress-tests', icon: <Flame className="w-4 h-4" />, description: 'Market shock, pandemic, and catastrophe scenarios' },
      { name: 'Reverse Stress', href: '/risk/reverse-stress', icon: <TrendingDown className="w-4 h-4" />, description: 'Identify scenarios that break the business' },
    ],
  },
  {
    id: 'governance',
    title: 'Risk Governance',
    items: [
      { name: 'Capital Allocation', href: '/risk/capital', icon: <Target className="w-4 h-4" />, description: 'Economic capital by business unit', croOnly: true },
      { name: 'Risk Appetite', href: '/risk/appetite', icon: <ShieldCheck className="w-4 h-4" />, description: 'Board-approved risk tolerance framework', croOnly: true },
    ],
  },
];

export const RiskLayout: React.FC = () => {
  const location = useLocation();
  const roles = useAuthStore((s) => s.user?.roles);
  const isCRO = roles?.includes('cro') || roles?.includes('admin');

  return (
    <div className="flex h-full gap-0 -m-6 md:-m-8">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Risk Management</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isCRO ? 'Chief Risk Officer — governance authority' : 'Risk Analyst — quantitative analysis'}
          </p>
        </div>

        <nav className="flex-1 py-3">
          {RISK_NAV.map((group) => {
            const visible = group.items.filter(item => !item.croOnly || isCRO);
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
                        <NavLink to={item.href} title={item.description}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group
                            ${isActive ? 'bg-sky-50 text-sky-800 shadow-sm border border-sky-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}>
                          <span className={`shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-500'}`}>{item.icon}</span>
                          <span className="flex-1 truncate">{item.name}</span>
                          {item.croOnly && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
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
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>VaR Confidence: <span className="font-semibold text-slate-500">99%</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Capital Status: <span className="font-semibold text-slate-500">Adequate</span></span>
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
