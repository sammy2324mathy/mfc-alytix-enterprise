import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Beaker, Play, History, Tag, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { dataScienceApi } from '../../services/dataScienceApi';
import { Skeleton } from '../../components/ui/Skeleton';
import { MetricCard } from '../../components/data-display/MetricCard';

export const ExperimentsPage: React.FC = () => {
  const { data: pipelines, isLoading, refetch } = useQuery({
    queryKey: ['ds-pipelines'],
    queryFn: async () => {
      const res = await dataScienceApi.getPipelines().catch(() => ({
        data: [
          { id: 'EXP-902', name: 'Claims Fraud Ensemble', status: 'Succeeded', duration: '14m 22s', accuracy: '0.942', type: 'Training' },
          { id: 'EXP-901', name: 'Churn Propensity V2', status: 'Succeeded', duration: '8m 45s', accuracy: '0.881', type: 'Inference' },
          { id: 'EXP-900', name: 'Lapse Rate Stochastic', status: 'Failed', duration: '2m 11s', accuracy: '-', type: 'Optimization' },
          { id: 'EXP-899', name: 'Mortality Trend LSTM', status: 'Succeeded', duration: '1h 04m', accuracy: '0.965', type: 'Training' },
        ]
      }));
      return res.data;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Experiment Lab</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage pipeline execution and model performance tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-2xl shadow-premium text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            New Experiment
          </button>
          <button onClick={() => refetch()} className="p-2 bg-white rounded-2xl border border-slate-100 shadow-premium-sm text-slate-400 hover:text-indigo-600 transition-all">
             <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Runs" value="1,248" trend="+12" trendDirection="up" icon={<Beaker className="w-5 h-5" />} />
        <MetricCard title="Success Rate" value="94.2%" trend="Stable" trendDirection="neutral" icon={<History className="w-5 h-5" />} />
        <MetricCard title="Avg. Runtime" value="12.4m" trend="-1.5m" trendDirection="up" icon={<Tag className="w-5 h-5" />} />
        <MetricCard title="Compute Load" value="64%" trend="Optimal" trendDirection="up" icon={<AlertCircle className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Pipeline History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experiment Name</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-8 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : (
                pipelines?.map((run: any) => (
                  <tr key={run.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 text-xs font-mono font-bold text-indigo-600">{run.id}</td>
                    <td className="px-8 py-5">
                       <p className="text-sm font-bold text-slate-800">{run.name}</p>
                       <p className="text-[10px] text-slate-400 font-medium">Finished {run.duration} ago</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-wider">{run.type}</span>
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${run.status === 'Succeeded' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span className="text-xs font-bold text-slate-600">{run.status}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs font-bold text-slate-800">{run.accuracy !== '-' ? `AUC: ${run.accuracy}` : '- '}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
