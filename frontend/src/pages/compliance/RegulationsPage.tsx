import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, AlertCircle, CheckCircle2, ShieldCheck, Clock, RefreshCw } from 'lucide-react';
import { complianceApi, Framework } from '../../services/complianceApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { Skeleton } from '../../components/ui/Skeleton';

export const RegulationsPage: React.FC = () => {
  const { data: frameworks, isLoading, refetch } = useQuery({
    queryKey: ['regulations'],
    queryFn: async () => {
      // Fetch from API or use mock if API not ready
      const res = await complianceApi.getFrameworks().catch(() => ({
        data: [
          { id: 'IFRS-17', name: 'IFRS 17 Insurance Contracts', deadline: '2023-01-01', status: 'Adopted' as const, progress: 100 },
          { id: 'SOLV-II', name: 'Solvency II Directive', deadline: '2016-01-01', status: 'Adopted' as const, progress: 100 },
          { id: 'LDTI', name: 'US GAAP LDTI', deadline: '2025-01-01', status: 'In Progress' as const, progress: 85 },
          { id: 'ESG-CSRD', name: 'Corporate Sustainability Reporting (CSRD)', deadline: '2026-01-01', status: 'Planning' as const, progress: 30 },
          { id: 'IFRS-9', name: 'Financial Instruments', deadline: '2023-01-01', status: 'Adopted' as const, progress: 100 },
          { id: 'KICS', name: 'Korea Insurance Capital Standard', deadline: '2023-01-01', status: 'In Progress' as const, progress: 92 },
        ]
      }));
      return res.data;
    }
  });

  const adoptedCount = frameworks?.filter(f => f.status === 'Adopted').length || 0;
  const inProgressCount = frameworks?.filter(f => f.status === 'In Progress').length || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Regulatory Frameworks</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Compliance oversight and statutory implementation tracking.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-premium border border-slate-100 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Registry Sync
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Standards Adopted" value={String(adoptedCount)} trend="Clean" trendDirection="up" description="Fully implemented" icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="In Transition" value={String(inProgressCount)} trend="On Track" trendDirection="neutral" description="Active implementation" icon={<Clock className="w-5 h-5 text-amber-500" />} />
        <MetricCard title="Compliance Score" value="94%" trend="+2.1%" trendDirection="up" description="Aggregate risk rating" icon={<ShieldCheck className="w-5 h-5 text-indigo-500" />} />
        <MetricCard title="Audit Readiness" value="Level 4" trend="Optimized" trendDirection="up" description="Continuous monitoring" icon={<CheckCircle2 className="w-5 h-5 text-indigo-500" />} />
      </div>

      <ChartContainer title="Framework Implementation Index" subtitle="Strategic alignment with global insurance standards">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-40 rounded-3xl" />)
          ) : (
            frameworks?.map((fw) => (
              <div key={fw.id} className="group p-6 rounded-3xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-premium-lg transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen className="w-12 h-12 text-slate-400" />
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    fw.status === 'Adopted' ? 'bg-emerald-50 text-emerald-600' : 
                    fw.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {fw.status}
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 font-mono">{fw.id}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">{fw.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium mb-6 flex items-center gap-1.5">
                   <Clock className="w-3 h-3" />
                   Deadline: <span className="text-slate-500">{fw.deadline}</span>
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Maturity</span>
                    <span className="text-xs font-bold text-slate-800">{fw.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-1.5 border border-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        fw.progress === 100 ? 'bg-emerald-500' : 
                        fw.progress > 50 ? 'bg-amber-400' : 
                        'bg-indigo-400'
                      }`} 
                      style={{ width: `${fw.progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ChartContainer>
    </div>
  );
};
