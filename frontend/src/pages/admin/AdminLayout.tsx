import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const adminTabs = [
  { name: 'User Directory', href: '/admin/users' },
  { name: 'Role Definitions', href: '/admin/roles' },
  { name: 'Global Audit Logs', href: '/admin/audit' },
  { name: 'Platform Settings', href: '/admin/settings' },
];

export const AdminLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administration Console</h1>
        <p className="text-slate-500 mt-1">Manage platform access, organization topography, and system-wide configurations.</p>
      </div>
      
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {adminTabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.href);
            return (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-indigo-600 text-indigo-700' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-h-0">
        <Outlet />
      </div>
    </div>
  );
};
