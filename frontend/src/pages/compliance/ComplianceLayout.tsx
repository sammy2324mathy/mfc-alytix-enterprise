import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Gavel,
  Lock,
  Scale,
  Shield,
} from 'lucide-react';

interface ComplianceNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  ccoOnly?: boolean;
}

interface ComplianceNavGroup {
  id: string;
  title: string;
  items: ComplianceNavItem[];
}

const COMPLIANCE_NAV: ComplianceNavGroup[] = [
  {
    id: 'regulatory',
    title: 'Regulatory Intelligence',
    items: [
      { name: 'Frameworks & Rules', href: '/compliance/regulations', icon: <Gavel className="w-4 h-4" />, description: 'IFRS 17, NAIC, SAM, ORSA regulatory tracker' },
      { name: 'Policy Register', href: '/compliance/policies', icon: <BookOpen className="w-4 h-4" />, description: 'Internal compliance policies and procedures' },
    ],
  },
  {
    id: 'filings',
    title: 'Filings & Disclosures',
    items: [
      { name: 'Filing Pipeline', href: '/compliance/reports', icon: <FileText className="w-4 h-4" />, description: 'Statutory filings: submit, review, sign, file' },
      { name: 'Audit Trail', href: '/compliance/audit', icon: <ClipboardCheck className="w-4 h-4" />, description: 'Compliance event log and evidence management' },
    ],
  },
  {
    id: 'governance',
    title: 'Governance',
    items: [
      { name: 'Regulatory Sign-off', href: '/compliance/signoff', icon: <Scale className="w-4 h-4" />, description: 'CCO final approval for regulatory submissions', ccoOnly: true },
    ],
  },
];

export const ComplianceLayout: React.FC = () => {
  const location = useLocation();
  const roles = useAuthStore((s) => s.user?.roles);
  const isCCO = roles?.includes('chief_compliance_officer') || roles?.includes('admin');

  return (
    <div className="flex h-full gap-0 -m-6 md:-m-8">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Compliance Office</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isCCO ? 'Chief Compliance Officer — regulatory authority' : 'Compliance Officer — filings & monitoring'}
          </p>
        </div>

        <nav className="flex-1 py-3">
          {COMPLIANCE_NAV.map((group) => {
            const visible = group.items.filter(item => !item.ccoOnly || isCCO);
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
                            ${isActive ? 'bg-amber-50 text-amber-800 shadow-sm border border-amber-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}>
                          <span className={`shrink-0 ${isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-500'}`}>{item.icon}</span>
                          <span className="flex-1 truncate">{item.name}</span>
                          {item.ccoOnly && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
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
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Next filing: <span className="font-semibold text-slate-500">ORSA Q1 2026</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Compliance status: <span className="font-semibold text-slate-500">Current</span></span>
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
