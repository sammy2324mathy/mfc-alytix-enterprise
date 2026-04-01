import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Briefcase, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { financialApi } from '../../services/financialApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { workspaceApi } from '../../services/workspaceApi';

export const ProjectsDashboard: React.FC = () => {
  const { user } = useAuthStore();
  
  const { data: projects, isLoading: isFinLoading } = useQuery({
    queryKey: ['projects-dashboard'],
    queryFn: financialApi.getProjectDashboard
  });

  const { data: workspaceProjects, isLoading: isWsLoading } = useQuery({
    queryKey: ['workspace-projects'],
    queryFn: workspaceApi.getProjects
  });

  const isLoading = isFinLoading || isWsLoading;

  const joinedProjects = React.useMemo(() => {
    if (!workspaceProjects) return projects;
    return workspaceProjects.map((wp: any) => {
      const fin = projects?.find((p: any) => p.name === wp.name);
      return {
        ...wp,
        budget: fin?.budget || 0,
        actual_cost: fin?.actual_cost || 0,
        variance: fin?.variance || 0,
        id: fin?.id || wp.project_id,
        status: wp.status || fin?.status || 'ACTIVE',
        client: fin?.client || 'Internal'
      };
    });
  }, [projects, workspaceProjects]);

  const totalBudget = joinedProjects?.reduce((acc: number, p: any) => acc + (p.budget || 0), 0) || 0;
  const totalActual = joinedProjects?.reduce((acc: number, p: any) => acc + (p.actual_cost || 0), 0) || 0;
  const avgVariance = joinedProjects?.length ? (totalBudget - totalActual) / joinedProjects.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Intelligence</h2>
          <p className="text-sm text-slate-500">Portfolio performance, multi-dimensional costing, and budget orchestration.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> New Initiative
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Projects" value={joinedProjects?.length.toString() || '0'} trend="Strategic Backlog" trendDirection="up" icon={<Briefcase className="w-5 h-5" />} />
        <MetricCard title="Total Portfolio Budget" value={`$${(totalBudget / 1000000).toFixed(1)}M`} trend="FY2026 Allocated" trendDirection="neutral" icon={<DollarSign className="w-5 h-5" />} />
        <MetricCard title="Burn Rate" value={`$${((totalActual / totalBudget) * 100).toFixed(1)}%`} trend="Utilization" trendDirection="down" icon={<TrendingUp className="w-5 h-5" />} />
        <MetricCard title="Avg. Variance" value={`$${(avgVariance / 1000).toFixed(1)}K`} trend="Cost Control" trendDirection="up" icon={<CheckCircle2 className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Budget vs Actual by Project</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={joinedProjects}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e880', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="budget" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="actual_cost" fill="#6366f1" radius={[4, 4, 0, 0]} name="Actual Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Operational Health</h3>
          </div>
          <div className="p-5 space-y-6">
            {joinedProjects?.map((p: any) => {
              const perc = p.budget > 0 ? (p.actual_cost / p.budget) * 100 : 0;
              return (
                <div key={p.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{p.name}</span>
                    <span className="text-slate-500 font-mono">{perc.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${perc > 90 ? 'bg-rose-500' : perc > 70 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min(perc, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>${(p.actual_cost / 1000).toFixed(1)}K spent</span>
                    <span>${(p.budget / 1000).toFixed(1)}K budget</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Strategic Initiative Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b">
              <tr>
                <th className="px-5 py-3">Initiative</th>
                <th className="px-5 py-3">Stakeholder</th>
                <th className="px-5 py-3 text-right">Variance</th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {(projects || []).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-[10px] flex items-center gap-1"><Clock className="w-3 h-3" /> Ends Dec 2026</div>
                  </td>
                  <td className="px-5 py-4">{p.client}</td>
                  <td className={`px-5 py-4 text-right font-mono font-bold ${p.variance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ${(p.variance / 1000).toFixed(1)}K
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {p.status}
                    </span>
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
