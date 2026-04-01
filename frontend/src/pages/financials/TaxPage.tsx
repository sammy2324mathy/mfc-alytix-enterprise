import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Receipt, FileText, AlertTriangle, CheckCircle, Lock, Send, Download, Calendar, Play } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialApi } from '../../services/financialApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

export const TaxPage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const isAdminOrChief = user?.roles.includes('admin') || user?.roles.includes('chief_accountant');

  const { data: returns, isLoading: isLoadingReturns } = useQuery({
    queryKey: ['tax-returns'],
    queryFn: financialApi.getTaxReturns
  });

  const { data: vatSummary } = useQuery({
    queryKey: ['vat-summary'],
    queryFn: financialApi.getVatSummary
  });

  const generateMutation = useMutation({
    mutationFn: (period: string) => financialApi.generateVat(period),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tax-returns'] })
  });

  const fileMutation = useMutation({
    mutationFn: (id: number) => financialApi.fileReturn(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tax-returns'] })
  });

  const totalLiability = returns?.filter(r => r.status !== 'FILED').reduce((acc, r) => acc + r.tax_liability, 0) || 0;
  const overdueCount = returns?.filter(r => r.status !== 'FILED' && new Date(r.due_date) < new Date()).length || 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tax Management</h2>
          <p className="text-sm text-slate-500">
            VAT/GST returns, corporate income tax provisioning, PAYE withholding, and statutory filing —
            aligned with enterprise tax compliance workflows.
          </p>
        </div>
        <button 
          onClick={() => generateMutation.mutate('Dec 2025')}
          disabled={generateMutation.isPending}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-sky-700 transition flex items-center gap-2"
        >
          {generateMutation.isPending ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Play className="w-4 h-4" />}
          Generate VAT Return
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Outstanding Tax Liability" value={`$${totalLiability.toLocaleString()}`} trend="Across all tax types" trendDirection="down" icon={<Receipt className="w-5 h-5" />} />
        <MetricCard title="VAT Net Payable (Nov)" value="$18,000" trend="Output less Input" trendDirection="neutral" icon={<FileText className="w-5 h-5" />} />
        <MetricCard title="CIT Provision (YTD)" value="$1.14M" trend="25% effective rate" trendDirection="down" icon={<Calendar className="w-5 h-5" />} />
        <MetricCard
          title="Overdue Returns"
          value={overdueCount.toString()}
          trend={overdueCount > 0 ? 'Action required' : 'All current'}
          trendDirection={overdueCount > 0 ? 'down' : 'up'}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* VAT Summary Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">VAT / GST Monthly Summary ($)</h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vatSummary || []} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} tickFormatter={val => `$${val/1000}k`} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`$${value.toLocaleString()}`, undefined]} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="outputVAT" name="Output VAT (Collected)" fill="#f472b6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inputVAT" name="Input VAT (Paid)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="net" name="Net VAT Payable" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tax Returns Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Tax Returns & Filing Queue</h3>
          {!isAdminOrChief && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Filing authority restricted to Chief Accountant
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Return ID</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Tax Type</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Period</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Due Date</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Liability</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {((returns || [])).map((ret: any) => (
                <tr key={ret.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{ret.return_id}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{ret.tax_type}</td>
                  <td className="px-6 py-4">{ret.period}</td>
                  <td className="px-6 py-4">
                    <span className={new Date(ret.due_date) < new Date() && ret.status !== 'FILED' ? 'text-rose-600 font-semibold' : ''}>
                      {new Date(ret.due_date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-slate-900">
                    ${ret.tax_liability.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      ret.status === 'FILED' ? 'bg-emerald-100 text-emerald-700' :
                      ret.status === 'DRAFT' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {ret.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {ret.status === 'DRAFT' && (
                      <button 
                        onClick={() => fileMutation.mutate(ret.id)}
                        disabled={fileMutation.isPending}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-end gap-1 ml-auto"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit for Filing
                      </button>
                    )}
                    {ret.status === 'READY' && (
                      isAdminOrChief ? (
                        <button 
                          onClick={() => fileMutation.mutate(ret.id)}
                          disabled={fileMutation.isPending}
                          className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-xs font-semibold shadow-sm flex items-center gap-1 ml-auto"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> File & Pay
                        </button>
                      ) : (
                        <span className="text-[11px] italic text-slate-400 flex items-center justify-end gap-1"><Lock className="w-3 h-3" /> Chief must file</span>
                      )
                    )}
                    {ret.status === 'FILED' && (
                      <button className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center justify-end gap-1 ml-auto">
                        <Download className="w-3.5 h-3.5" /> Receipt
                      </button>
                    )}
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
