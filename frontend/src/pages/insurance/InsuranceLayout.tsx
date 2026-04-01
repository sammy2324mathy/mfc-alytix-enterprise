import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Shield, FileSignature, Activity, Gavel, ChevronRight, BarChart3,
} from 'lucide-react';
import { InsuranceNotifications } from '../../components/insurance/InsuranceNotifications';

const NAV_ITEMS = [
  { href: '/insurance/policies', name: 'Policy Management', icon: <Shield className="w-4 h-4" /> },
  { href: '/insurance/enroll', name: 'New Enrollment', icon: <FileSignature className="w-4 h-4" /> },
  { href: '/insurance/claims', name: 'Claims Management', icon: <Gavel className="w-4 h-4" /> },
  { href: '/insurance/analytics', name: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
];

export const InsuranceLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-full gap-0 -m-6 md:-m-8">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Insurance & Assurance</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Policy lifecycle & claims</p>
            </div>
            <InsuranceNotifications />
          </div>
        </div>

        <nav className="flex-1 py-3">
          <div className="px-5 pt-3 pb-1.5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations</h3>
          </div>
          <ul className="space-y-0.5 px-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-500'}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1 truncate">{item.name}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Insurance Operations <span className="font-semibold text-slate-500">Active</span></span>
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
