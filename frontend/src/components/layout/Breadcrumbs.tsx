import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map internal technical segments to high-fidelity labels
  const labelMap: Record<string, string> = {
    'accounting': 'Finance',
    'ledger': 'General Ledger',
    'ar': 'Accounts Receivable',
    'ap': 'Accounts Payable',
    'cash': 'Cash & Bank',
    'assets': 'Fixed Assets',
    'inventory': 'Inventory Control',
    'procurement': 'Procurement',
    'manufacturing': 'Manufacturing',
    'payroll': 'Payroll & HR',
    'tax': 'Taxation',
    'reports': 'Reports',
    'decisions': 'FP&A Decisions',
    'risk': 'Risk Management',
    'actuarial': 'Actuarial Lab',
    'compliance': 'Governance & Compliance',
    'admin': 'Enterprise Admin',
    'dashboard': 'Control Center',
    'ai': 'AI Hub',
    'data-science': 'Data Science Lab'
  };

  return (
    <nav className="flex items-center space-x-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-6 animate-fade-in">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group"
      >
        <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        <span>Enterprise</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const label = labelMap[value] || value.replace(/_/g, ' ');

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            {last ? (
              <span className="text-indigo-600 drop-shadow-sm">{label}</span>
            ) : (
              <Link 
                to={to} 
                className="hover:text-slate-600 transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
