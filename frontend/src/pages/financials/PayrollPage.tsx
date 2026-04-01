import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Users, CreditCard, ShieldCheck, Download, Play, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialApi } from '../../services/financialApi';

export const PayrollPage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isAdminOrChief = user?.roles.includes('admin') || user?.roles.includes('chief_accountant');

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: financialApi.getEmployees
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['payroll-history'],
    queryFn: financialApi.getPayrollHistory
  });

  const processMutation = useMutation({
    mutationFn: (empId: number) => financialApi.processPayroll(empId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-history'] });
    }
  });

  const totalHeadcount = employees?.length || 0;
  const totalMonthlyGross = employees?.reduce((acc, emp) => acc + Number(emp.base_salary), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payroll & HR Compliance</h2>
          <p className="text-sm text-slate-500">Employee lifecycle management, automated payroll, and statutory reporting.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add Employee
          </button>
          {isAdminOrChief && (
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2">
              <Play className="w-4 h-4" /> Run Payroll Batch
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Headcount" value={totalHeadcount.toString()} trend="+2 this month" trendDirection="up" icon={<Users className="w-5 h-5" />} />
        <MetricCard title="Monthly Gross Pay" value={`$${(totalMonthlyGross / 1000).toFixed(1)}K`} trend="Budgeted" trendDirection="neutral" icon={<CreditCard className="w-5 h-5" />} />
        <MetricCard title="Compliance Status" value="100%" trend="Clean Audit" trendDirection="up" icon={<ShieldCheck className="w-5 h-5" />} />
        <MetricCard title="Next Pay Date" value="Mar 31" trend="In 8 days" trendDirection="neutral" icon={<Play className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-800">Employee Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3 text-right">Base Salary</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(isLoadingEmployees ? Array(3).fill({}) : (employees || [])).map((emp: any, idx: number) => (
                  <tr key={emp.id || idx} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{emp.first_name} {emp.last_name}</div>
                      <div className="text-xs text-slate-500">{emp.job_title}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{emp.department}</td>
                    <td className="px-5 py-4 text-right font-mono">${Number(emp.base_salary || 0).toLocaleString()}</td>
                    <td className="px-5 py-4 text-center">
                      <button 
                        onClick={() => processMutation.mutate(emp.id)}
                        disabled={processMutation.isPending}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
                      >
                        {processMutation.isPending ? 'Processing...' : 'Process Pay'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Recent Payruns</h3>
          </div>
          <div className="p-5 space-y-4">
            {history?.slice(0, 5).map((entry: any) => (
              <div key={entry.id} className="flex justify-between items-center p-3 border border-slate-100 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-900">Period Ending Mar 23</div>
                  <div className="text-xs text-slate-500">Employee ID: {entry.employee_id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600">${Number(entry.net_pay).toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{entry.status}</div>
                </div>
              </div>
            ))}
            {!history?.length && <div className="text-center text-slate-400 py-8 text-sm italic">No recent payruns found</div>}
            <button className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 transition flex items-center justify-center gap-2">
              <Download className="w-3 h-3" /> Export Payroll Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
