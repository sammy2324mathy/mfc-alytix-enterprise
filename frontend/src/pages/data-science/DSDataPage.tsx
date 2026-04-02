import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Database, RefreshCw, CheckCircle, AlertTriangle, Play, Settings, ChevronRight, PlayCircle } from 'lucide-react';
import { dataScienceApi } from '../../services/dataScienceApi';
import { Skeleton } from '../../components/ui/Skeleton';
import { MetricCard } from '../../components/data-display/MetricCard';
import { toast } from 'react-hot-toast';

export const DSDataPage: React.FC = () => {
  const { data: pipelines, isLoading, refetch } = useQuery({
    queryKey: ['ds-data-pipelines'],
    queryFn: async () => {
      const res = await dataScienceApi.getPipelines().catch(() => ({
          data: [
            { id: 'PL-001', name: 'Policy Master ETL', source: 'Core Insurance DB', schedule: 'Every 2 hours', records: '1.84M', status: 'Healthy', lastRun: '14 min ago' },
            { id: 'PL-002', name: 'Claims Ingestion', source: 'Claims API + CSV Upload', schedule: 'Hourly', records: '421K', status: 'Healthy', lastRun: '32 min ago' },
            { id: 'PL-003', name: 'Customer 360 Builder', source: 'CRM + Policy + Claims', schedule: 'Daily 02:00', records: '892K', status: 'Healthy', lastRun: '5 hours ago' },
            { id: 'PL-004', name: 'Premium Transactions', source: 'Finance Ledger', schedule: 'Every 4 hours', records: '2.1M', status: 'Healthy', lastRun: '1 hour ago' },
            { id: 'PL-005', name: 'External Market Data', source: 'Bloomberg API', schedule: 'Daily 06:00', records: '45K', status: 'Warning', lastRun: '18 hours ago' },
            { id: 'PL-006', name: 'Fraud Feature Store', source: 'Derived Features', schedule: 'Every 30 min', records: '3.2M', status: 'Healthy', lastRun: '8 min ago' },
          ]
      }));
      return res.data;
    }
  });

  const { mutate: runPipeline, isPending: isRunning } = useMutation({
    mutationFn: (id: string) => dataScienceApi.runPipeline(id),
    onSuccess: (_, id) => {
      toast.success(`Pipeline ${id} triggered successfully`);
      refetch();
    },
    onError: () => {
      toast.error('Failed to trigger pipeline execution');
    }
  });

  const handleRunAll = () => {
    toast.promise(
      Promise.all(pipelines?.map((p: any) => dataScienceApi.runPipeline(p.id)) || []),
      {
        loading: 'Orchestrating all pipelines...',
        success: 'All pipelines triggered successfully',
        error: 'One or more pipelines failed to start',
      }
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Data Engineering</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Ingestion, ETL pipelines, and feature store orchestration.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleRunAll}
             className="px-4 py-2 bg-indigo-600 text-white rounded-2xl shadow-premium text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
           >
            <Play className="w-4 h-4 fill-current" />
            Run All ETL
          </button>
          <button onClick={() => refetch()} className="p-2 bg-white rounded-2xl border border-slate-100 shadow-premium-sm text-slate-400 hover:text-indigo-600 transition-all">
             <RefreshCw className={`w-5 h-5 ${isLoading || isRunning ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Pipelines" value="6" trend="All Validated" trendDirection="up" icon={<Database className="w-5 h-5" />} />
        <MetricCard title="Total Records" value="8.5M" trend="+1.2M MoM" trendDirection="up" icon={<RefreshCw className="w-5 h-5" />} />
        <MetricCard title="Sanity Score" value="96.7%" trend="Stable" trendDirection="neutral" icon={<CheckCircle className="w-5 h-5" />} />
        <MetricCard title="Alerts (24h)" value="1" trend="Resolved" trendDirection="up" icon={<AlertTriangle className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Pipeline Orchestration</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pipeline</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source Entity</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Records</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Run</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-8 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : (
                pipelines?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <p className="text-sm font-bold text-slate-800">{p.name}</p>
                       <p className="text-[10px] text-slate-400 font-mono font-bold">{p.id}</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{p.source}</span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono font-bold text-xs text-slate-700">{p.records}</td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">{p.schedule}</td>
                    <td className="px-8 py-5">
                       <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-xl tracking-wider ${
                         p.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                       }`}>
                         {p.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => runPipeline(p.id)}
                            className="p-2 text-slate-300 hover:text-indigo-600 transition-colors" 
                            title="Run Pipeline"
                          >
                             <PlayCircle className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                             <Settings className="w-4 h-4" />
                          </button>
                       </div>
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
