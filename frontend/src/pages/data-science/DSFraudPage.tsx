import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SearchX, AlertTriangle, DollarSign, ShieldCheck, RefreshCw, XCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { dataScienceApi } from '../../services/dataScienceApi';
import { Skeleton } from '../../components/ui/Skeleton';
import { MetricCard } from '../../components/data-display/MetricCard';

export const DSFraudPage: React.FC = () => {
  const { data: flaggedClaims, isLoading, refetch } = useQuery({
    queryKey: ['ds-flagged-claims'],
    queryFn: async () => {
      const res = await dataScienceApi.getFlaggedClaims();
      // Ensure we always have an array
      return Array.isArray(res.data) ? res.data : (res as any) || [];
    }
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ claimId, status }: { claimId: string, status: string }) => 
      dataScienceApi.updateReviewStatus(claimId, status),
    onSuccess: () => {
      refetch();
    }
  });

  const { mutate: scanForAnomalies, isPending: isScanning } = useMutation({
    mutationFn: dataScienceApi.scanForAnomalies,
    onSuccess: () => refetch()
  });

  const handleAction = (claimId: string, status: string) => {
    updateStatus({ claimId, status });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Fraud Intelligence</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Anomaly detection and claim integrity monitoring.</p>
        </div>
        <button onClick={() => scanForAnomalies()} disabled={isScanning} className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-premium border border-slate-100 text-sm font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all">
          <RefreshCw className={`w-4 h-4 ${isScanning || isLoading ? 'animate-spin' : ''}`} />
          Scan For Anomalies
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Fraud Engine" value="XGBoost v2.1" trend="A+ Precision" trendDirection="up" icon={<SearchX className="w-5 h-5" />} />
        <MetricCard title="Claims Flagged" value="23" trend="Critical" trendDirection="down" icon={<AlertTriangle className="w-5 h-5 text-rose-500" />} />
        <MetricCard title="Loss Prevention" value="$2.8M" trend="+41% YoY" trendDirection="up" icon={<DollarSign className="w-5 h-5" />} />
        <MetricCard title="False Positives" value="12.4%" trend="Optimal" trendDirection="up" icon={<ShieldCheck className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-rose-50/20 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-500" />
            High-Risk Anomaly Queue
          </h3>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-widest">Priority Attention</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claim ID</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claimant Profile</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Exposure</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Score</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Reason</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-8 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : (
                flaggedClaims?.map((c: any) => (
                  <tr key={c.claim_id} className="hover:bg-rose-50/10 transition-colors group">
                    <td className="px-8 py-5">
                       <p className="text-xs font-mono font-bold text-rose-600">{c.claim_id}</p>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-sm font-bold text-slate-800">{c.claimant}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{c.type || c.claim_type} Policy</p>
                    </td>
                    <td className="px-8 py-5 text-right font-mono font-bold text-xs text-rose-700">
                      {typeof c.amount === 'number' ? `$${c.amount.toLocaleString()}` : c.amount}
                    </td>
                    <td className="px-8 py-5">
                       <div className="flex flex-col items-center gap-1">
                          <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                             <div className="h-full bg-rose-500" style={{ width: `${(c.fraud_score || c.score) * 100}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-rose-600">{((c.fraud_score || c.score) * 100).toFixed(0)}%</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500 max-w-[280px] font-medium leading-relaxed">
                      {Array.isArray(c.reasons) ? c.reasons[0] : (c.reasons || c.reason)}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleAction(c.claim_id, 'cleared')}
                            title="Clear Anomaly"
                            className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"
                          >
                             <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleAction(c.claim_id, 'under_review')}
                            title="Escalate to Review"
                            className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                          >
                             <ChevronRight className="w-5 h-5" />
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
