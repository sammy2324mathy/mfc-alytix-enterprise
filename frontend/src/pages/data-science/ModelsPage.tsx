import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, ShieldCheck, Cpu, HardDrive, RefreshCw, ExternalLink, Activity } from 'lucide-react';
import { dataScienceApi } from '../../services/dataScienceApi';
import { Skeleton } from '../../components/ui/Skeleton';
import { MetricCard } from '../../components/data-display/MetricCard';

export const ModelsPage: React.FC = () => {
  const { data: models, isLoading, refetch } = useQuery({
    queryKey: ['ds-models'],
    queryFn: async () => {
      const res = await dataScienceApi.getDeployedModels().catch(() => ({
        data: [
          { id: 'MOD-V42', name: 'FraudX Ensemble', version: '4.2.0', status: 'Active', latency: '42ms', traffic: '12%', lastUpdated: '2d ago' },
          { id: 'MOD-V38', name: 'Claims Risk LSTM', version: '3.8.4', status: 'Active', latency: '118ms', traffic: '88%', lastUpdated: '12d ago' },
          { id: 'MOD-V12', name: 'Churn Master', version: '1.2.1', status: 'Shadow', latency: '35ms', traffic: '0%', lastUpdated: '1h ago' },
          { id: 'MOD-V09', name: 'Pricing Optimizer', version: '0.9.8', status: 'Maintenance', latency: '-', traffic: '0%', lastUpdated: '5h ago' },
        ]
      }));
      return res.data;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Model Registry</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Deployment management, traffic routing, and health monitoring.</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-premium border border-slate-100 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Registry Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Deployed Models" value="12" trend="Active" trendDirection="up" icon={<Package className="w-5 h-5" />} />
        <MetricCard title="System Latency" value="68ms" trend="-4ms" trendDirection="up" icon={<Activity className="w-5 h-5" />} />
        <MetricCard title="Traffic Volume" value="892K" trend="High" trendDirection="neutral" icon={<Cpu className="w-5 h-5" />} />
        <MetricCard title="Compliance" value="Verified" trend="Clean" trendDirection="up" icon={<ShieldCheck className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-3xl" />)
        ) : (
          models?.map((model: any) => (
            <div key={model.id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium group hover:border-indigo-100 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-inner group-hover:bg-indigo-600 transition-colors">
                     <HardDrive className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    model.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                    model.status === 'Shadow' ? 'bg-indigo-50 text-indigo-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {model.status}
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{model.name}</h3>
                  <p className="text-xs font-mono font-bold text-slate-400 tracking-tighter">{model.id} • v{model.version}</p>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inference Latency</p>
                    <p className="text-sm font-bold text-slate-800">{model.latency}</p>
                  </div>
                   <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Traffic Routing</p>
                    <p className="text-sm font-bold text-slate-800">{model.traffic}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Last Deployment: {model.lastUpdated}</span>
                 <button className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-all group-hover:gap-2">
                    Monitoring Panel <ExternalLink className="w-3.5 h-3.5" />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
