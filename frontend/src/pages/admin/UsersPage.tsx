import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { UserPlus, Edit2, ShieldAlert, Users, UserCheck, Lock } from 'lucide-react';

const enterpriseUsers = [
  { id: 'usr_001', name: 'Eve Executive', email: 'admin@mfcalytix.com', role: 'admin', dept: 'Platform', status: 'Active', lastLogin: 'Just now' },
  { id: 'usr_002', name: 'Grace Govern', email: 'chief_accountant@mfcalytix.com', role: 'chief_accountant', dept: 'Finance', status: 'Active', lastLogin: '10 mins ago' },
  { id: 'usr_003', name: 'Charlie Count', email: 'junior@mfcalytix.com', role: 'junior_accountant', dept: 'Finance', status: 'Active', lastLogin: '1 hour ago' },
  { id: 'usr_004', name: 'Alice Actuary', email: 'chief_actuary@mfcalytix.com', role: 'chief_actuary', dept: 'Actuarial', status: 'Active', lastLogin: '3 hours ago' },
  { id: 'usr_005', name: 'Amy Analyst', email: 'actuary@mfcalytix.com', role: 'actuarial_analyst', dept: 'Actuarial', status: 'Active', lastLogin: '1 day ago' },
  { id: 'usr_006', name: 'Dana Data', email: 'datascientist@mfcalytix.com', role: 'data_scientist', dept: 'AI & MLOps', status: 'Active', lastLogin: '2 hours ago' },
  { id: 'usr_007', name: 'Bob Risk', email: 'risk@mfcalytix.com', role: 'risk_analyst', dept: 'Risk', status: 'Active', lastLogin: '30 mins ago' },
  { id: 'usr_008', name: 'Rex CRO', email: 'cro@mfcalytix.com', role: 'cro', dept: 'Risk', status: 'Active', lastLogin: '5 hours ago' },
  { id: 'usr_009', name: 'Cleo Comply', email: 'compliance@mfcalytix.com', role: 'compliance_officer', dept: 'Compliance', status: 'Active', lastLogin: '1 day ago' },
  { id: 'usr_010', name: 'Caroline CCO', email: 'chief_compliance@mfcalytix.com', role: 'chief_compliance_officer', dept: 'Compliance', status: 'Active', lastLogin: '3 days ago' },
  { id: 'usr_011', name: 'Frank Law', email: 'frank@mfcalytix.com', role: 'compliance_officer', dept: 'Compliance', status: 'Inactive', lastLogin: '1 month ago' },
  { id: 'usr_012', name: 'Gary Green', email: 'gary@mfcalytix.com', role: 'junior_accountant', dept: 'Finance', status: 'Active', lastLogin: '4 hours ago' },
];

const roleColors: Record<string, string> = {
  admin: 'bg-rose-100 text-rose-700 border-rose-200',
  chief_accountant: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  junior_accountant: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  chief_actuary: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  actuarial_analyst: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  data_scientist: 'bg-violet-100 text-violet-700 border-violet-200',
  risk_analyst: 'bg-sky-50 text-sky-600 border-sky-200',
  cro: 'bg-sky-100 text-sky-700 border-sky-200',
  compliance_officer: 'bg-amber-50 text-amber-600 border-amber-200',
  chief_compliance_officer: 'bg-amber-100 text-amber-700 border-amber-200',
};

export const UsersPage: React.FC = () => {
  const activeCount = enterpriseUsers.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Enterprise User Directory</h2>
          <p className="text-sm text-slate-500">Provision identity and coordinate role-based access across all departments.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Invite User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Users" value={enterpriseUsers.length.toString()} trend="12 accounts" trendDirection="neutral" icon={<Users className="w-5 h-5" />} />
        <MetricCard title="Active Users" value={activeCount.toString()} trend={`${Math.round(activeCount/enterpriseUsers.length*100)}% active`} trendDirection="up" icon={<UserCheck className="w-5 h-5" />} />
        <MetricCard title="Departments" value="6" trend="Finance, Actuarial, Risk, AI, Compliance, Admin" trendDirection="neutral" icon={<ShieldAlert className="w-5 h-5" />} />
        <MetricCard title="Distinct Roles" value="10" trend="Full ERP hierarchy" trendDirection="neutral" icon={<Lock className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Name & Email</th>
                <th className="px-6 py-4 font-semibold text-slate-700">System Role</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Department</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Last Login</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enterpriseUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${roleColors[user.role] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.dept}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      <span className="text-xs font-medium text-slate-600">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">{user.lastLogin}</td>
                  <td className="px-6 py-4 text-right">
                     <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit user">
                        <Edit2 className="w-4 h-4" />
                     </button>
                     <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Manage permissions">
                        <ShieldAlert className="w-4 h-4" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
