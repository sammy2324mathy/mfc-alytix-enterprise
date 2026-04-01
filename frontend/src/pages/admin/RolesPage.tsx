import React from 'react';
import { Shield, Key, Plus } from 'lucide-react';

const roles = [
  { id: 'admin', name: 'Global Administrator', users: 1, dept: 'Platform', level: 'Governance', permissions: ['Full System Override', 'User Provision', 'Platform Config', 'Audit Logs'] },
  { id: 'chief_accountant', name: 'Chief Accountant', users: 1, dept: 'Finance', level: 'Governance', permissions: ['Post Journals', 'Period Close', 'Statutory Sign-off', 'FP&A / Business Decisions'] },
  { id: 'junior_accountant', name: 'Junior Accountant', users: 2, dept: 'Finance', level: 'Operational', permissions: ['AR/AP Cycles', 'Cash & Bank', 'Payroll Input', 'Tax Workpapers', 'Draft Journals', 'Mgmt Reports'] },
  { id: 'chief_actuary', name: 'Chief Actuary', users: 1, dept: 'Actuarial', level: 'Governance', permissions: ['Commit Rate Changes', 'Approve Proposals', 'IBNR Sign-off', 'Mortality Table Authority'] },
  { id: 'actuarial_analyst', name: 'Actuarial Analyst', users: 2, dept: 'Actuarial', level: 'Operational', permissions: ['Draft Rate Proposals', 'Run Models', 'Claims Development', 'Mortality Analysis'] },
  { id: 'data_scientist', name: 'Data Scientist', users: 1, dept: 'AI & MLOps', level: 'Specialist', permissions: ['Model Config', 'Embedding Vectors', 'Experiment Tracking', 'RAG Knowledge Sources'] },
  { id: 'cro', name: 'Chief Risk Officer', users: 1, dept: 'Risk', level: 'Governance', permissions: ['Enact VaR Limits', 'Approve Stress Profiles', 'Capital Allocation', 'Board Risk Reports'] },
  { id: 'risk_analyst', name: 'Risk Analyst', users: 1, dept: 'Risk', level: 'Operational', permissions: ['Run Simulations', 'Draft Limit Proposals', 'Stress Test Execution', 'ESG Scenarios'] },
  { id: 'chief_compliance_officer', name: 'Chief Compliance Officer', users: 1, dept: 'Compliance', level: 'Governance', permissions: ['Sign & File to Regulator', 'Reject Filings', 'Regulatory Authority'] },
  { id: 'compliance_officer', name: 'Compliance Officer', users: 1, dept: 'Compliance', level: 'Operational', permissions: ['Draft Filings', 'Regulations Monitoring', 'Audit Report Generation'] },
];

const levelColors: Record<string, string> = {
  'Governance': 'bg-rose-100 text-rose-700',
  'Operational': 'bg-sky-100 text-sky-700',
  'Specialist': 'bg-violet-100 text-violet-700',
};

export const RolesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Role Definitions & Permissions</h2>
          <p className="text-sm text-slate-500">Enterprise RBAC policy matrix — maker-checker hierarchies across all departments.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Role
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${levelColors[role.level] || 'bg-slate-100 text-slate-600'}`}>
                  {role.level}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-full border border-slate-200">
                  {role.users} {role.users === 1 ? 'User' : 'Users'}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-0.5">{role.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-xs text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{role.id}</span>
              <span className="text-xs text-slate-400">• {role.dept}</span>
            </div>
            
            <div className="mt-auto space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Key className="w-3 h-3"/> Key Permissions</h4>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.map((perm, i) => (
                  <span key={i} className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[11px] font-medium rounded border border-sky-100">
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
