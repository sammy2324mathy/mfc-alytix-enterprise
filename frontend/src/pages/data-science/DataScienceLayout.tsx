import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  Database,
  ShieldAlert,
  DollarSign,
  SearchX,
  TrendingUp,
  Users,
  FileBarChart,
  BarChart3,
  Rocket,
  Scale,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DSNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

interface DSNavGroup {
  id: string;
  title: string;
  items: DSNavItem[];
}

const DS_NAV: DSNavGroup[] = [
  {
    id: 'data',
    title: 'Data Engineering',
    items: [
      { name: 'Data Management', href: '/data-science/data', icon: <Database className="w-4 h-4" />, description: 'Collection, cleaning, integration, and pipeline management' },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Modeling',
    items: [
      { name: 'Risk Modeling', href: '/data-science/risk', icon: <ShieldAlert className="w-4 h-4" />, description: 'Customer risk scoring, segmentation, and underwriting support' },
      { name: 'Pricing Models', href: '/data-science/pricing', icon: <DollarSign className="w-4 h-4" />, description: 'Premium optimization and actuarial model support' },
      { name: 'Fraud Detection', href: '/data-science/fraud', icon: <SearchX className="w-4 h-4" />, description: 'Anomaly detection, pattern recognition, flagging' },
      { name: 'Predictive Analytics', href: '/data-science/predictions', icon: <TrendingUp className="w-4 h-4" />, description: 'Claims forecasting, churn prediction, revenue estimation' },
    ],
  },
  {
    id: 'insights',
    title: 'Business Intelligence',
    items: [
      { name: 'Customer Analytics', href: '/data-science/customers', icon: <Users className="w-4 h-4" />, description: 'Behavior analysis, segmentation, personalization' },
      { name: 'Claims Optimization', href: '/data-science/claims', icon: <FileBarChart className="w-4 h-4" />, description: 'Severity/frequency analysis, cost reduction' },
      { name: 'Dashboards & Reports', href: '/data-science/dashboards', icon: <BarChart3 className="w-4 h-4" />, description: 'Interactive visualizations and management reporting' },
    ],
  },
  {
    id: 'ops',
    title: 'MLOps & Governance',
    items: [
      { name: 'Model Deployment', href: '/data-science/deployment', icon: <Rocket className="w-4 h-4" />, description: 'Production pipelines, monitoring, versioning' },
      { name: 'Data Governance', href: '/data-science/governance', icon: <Scale className="w-4 h-4" />, description: 'Privacy, compliance, ethics, and documentation' },
    ],
  },
];

export const DataScienceLayout: React.FC = () => {
  const location = useLocation();
  const roles = useAuthStore((s) => s.user?.roles);

  // Determine if we are in 'Workbench' mode (Lab or Modeler) to provide edge-to-edge workspace
  const isWorkbench = location.pathname.includes('/lab') || location.pathname === '/data-science';

  return (
    <div className="flex h-full gap-0 -m-6 md:-m-8 bg-[rgb(10,12,18)]">
      {!isWorkbench && (
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto animate-in slide-in-from-left duration-300">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Data Science</h2>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Insurance analytics, ML models, and governance</p>
        </div>

        <nav className="flex-1 py-3">
          {DS_NAV.map((group) => (
            <div key={group.id} className="mb-1">
              <div className="px-5 pt-4 pb-1.5">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</h3>
              </div>
              <ul className="space-y-0.5 px-2">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.href}>
                      <NavLink to={item.href} title={item.description}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group
                          ${isActive ? 'bg-cyan-50 text-cyan-800 shadow-sm border border-cyan-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}>
                        <span className={`shrink-0 ${isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-500'}`}>{item.icon}</span>
                        <span className="flex-1 truncate">{item.name}</span>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>Models in prod: <span className="font-semibold text-slate-500">14</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Pipeline health: <span className="font-semibold text-slate-500">All green</span></span>
            </div>
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-hidden flex flex-col ${isWorkbench ? 'p-0' : 'p-6 md:p-8 bg-slate-50/30'}`}>
        <Outlet />
      </div>
    </div>
  );
};
