import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  Fingerprint,
  History,
  Lock,
  Search,
  CheckCircle,
  AlertTriangle,
  Zap,
  ChevronRight,
  Filter,
  Loader2
} from 'lucide-react';
import { actuarialApi } from '../../services/actuarialApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { useSecurity } from '../../context/SecurityContext';

export const ClaimsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { maskData, isMaskingActive } = useSecurity();
  const [activeTab, setActiveTab] = useState<'stream' | 'peer-review'>('stream');

  const { data: claims, isLoading: loadingClaims } = useQuery({
    queryKey: ['claims-autonomous-decisions'],
    queryFn: actuarialApi.getAutonomousClaimsDecisions,
    refetchInterval: 5000
  });

  const { data: valuations, isLoading: loadingValuations } = useQuery({
    queryKey: ['liability-valuations'],
    queryFn: actuarialApi.getLiabilityValuations,
  });

  const reviewMutation = useMutation({
    mutationFn: (id: string) => actuarialApi.peerReviewValuation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liability-valuations'] });
    }
  });

  const triggerMutation = useMutation({
    mutationFn: () => actuarialApi.triggerAutonomousAdjudication(
      `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
      `POL-${Math.floor(100000 + Math.random() * 900000)}`,
      Math.floor(1000 + Math.random() * 50000),
      ['Life', 'P&C', 'Health'][Math.floor(Math.random() * 3)]
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims-autonomous-decisions'] });
    }
  });

  const avgConfidence = claims?.length 
    ? (claims.reduce((acc: number, d: any) => acc + d.confidence, 0) / claims.length).toFixed(1) 
    : '94.2';

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Scientific Lab Node</span>
           </div>
           <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Actuarial Operations</h2>
           <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              High-velocity autonomous claims adjudication coupled with expert peer review of liability valuations.
           </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
           <button 
             onClick={() => setActiveTab('stream')}
             className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'stream' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              NEURAL STREAM
           </button>
           <button 
             onClick={() => setActiveTab('peer-review')}
             className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'peer-review' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              EXPERT PEER REVIEW
           </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Adjudication Pulse" value={claims?.length?.toString() || '0'} trend="+12.4%" trendDirection="up" description="Claims processed (24h)" icon={<Activity className="w-5 h-5 text-indigo-500" />} />
        <MetricCard title="Lab Confidence" value={`${avgConfidence}%`} trend="Optimal" trendDirection="up" description="Neural alignment score" icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="Provisioned Assets" value="$14.2M" trend="+2.1%" trendDirection="up" description="Real-time reserve buffer" icon={<Zap className="w-5 h-5 text-amber-500" />} />
        <MetricCard title="Expert Calibrations" value="8" trend="Required" trendDirection="neutral" description="Pending peer review" icon={<Fingerprint className="w-5 h-5 text-indigo-500" />} />
      </div>

      {activeTab === 'stream' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Adjudication Stream */}
          <div className="xl:col-span-2 space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <Clock className="w-5 h-5 text-slate-400" /> Real-time Adjudications
                </h3>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => triggerMutation.mutate()} 
                      disabled={triggerMutation.isPending}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md flex items-center gap-2"
                    >
                       {triggerMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                       Trigger Manual Adjudication
                    </button>
                    <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Historical Archive</button>
                 </div>
             </div>

             <div className="space-y-4">
                {loadingClaims ? (
                   Array(5).fill(0).map((_, i) => <div key={i} className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-premium"><Skeleton className="h-12 w-full rounded-xl" /></div>)
                ) : claims && claims.length > 0 ? (
                   claims.map((a: any) => (
                      <div key={a.claim_id} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-premium hover:border-slate-300 transition-all group">
                         <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                               <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center border-2 transition-all ${
                                  a.payout_triggered ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                               }`}>
                                  {a.payout_triggered ? <CheckCircle className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                               </div>
                               <div>
                                  <div className="flex items-center gap-3">
                                     <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{a.policy_type} CLAIMS</span>
                                     <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg border ${
                                        a.payout_triggered ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                     }`}>
                                        {a.payout_triggered ? 'ADJUDICATED' : 'FLAGGED'}
                                     </span>
                                  </div>
                                  <p className="text-xs text-slate-500 font-medium mt-1">ID: {a.claim_id.slice(0, 8).toUpperCase()} • Claimant: <span className={isMaskingActive ? 'blur-[4px] select-none' : ''}>{a.claimant}</span></p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-lg font-black text-slate-900">${a.amount.toLocaleString()}</p>
                               <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-1">Confidence: {a.confidence}%</p>
                            </div>
                         </div>
                      </div>
                   ))
                ) : (
                   <div className="p-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200 text-slate-400 italic font-medium">
                      Neural stream active. Monitoring for incoming claim events...
                   </div>
                )}
             </div>
          </div>

          {/* Expert Overview Stats */}
          <div className="space-y-8">
             <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                   <ShieldCheck className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-xl font-bold mb-2">Neural Sovereignty</h3>
                   <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                      The AI Scientific Lab is currently handling 92% of all claims frequency. Only high-variance or anomalous loss events are diverted to the expert peer review queue.
                   </p>
                   <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Automation Rate</span>
                         <span className="text-2xl font-black text-emerald-400">92.4%</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expert Touchpoints</span>
                         <span className="text-2xl font-black text-amber-400">8.2%</span>
                      </div>
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mean Cycle Time</span>
                         <span className="text-2xl font-black text-indigo-400">0.8s</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-premium">
                <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <History className="w-5 h-5 text-indigo-600" /> Lab Audit Trail
                </h4>
                <div className="space-y-6">
                   {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4">
                         <div className="w-1 h-12 bg-slate-100 rounded-full shrink-0" />
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">2h ago</p>
                            <p className="text-xs font-bold text-slate-700">Neural core recalibrated mortality baseline for 2026-Q2.</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : (
        /* Expert Peer Review Tab */
        <div className="space-y-8 animate-fade-in">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {loadingValuations ? (
                Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-[40px]" />)
              ) : valuations && valuations.length > 0 ? (
                valuations.map((v: any) => (
                    <div key={v.id} className={`bg-white rounded-[40px] border-2 p-10 transition-all ${
                      v.status === 'PEER_REVIEWED' ? 'border-emerald-100 opacity-60' : 'border-slate-100 shadow-premium hover:border-indigo-100'
                    }`}>
                      <div className="flex flex-col gap-8">
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="text-2xl font-bold text-slate-900">{v.cohort}</h3>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">ID: {v.id.slice(0, 8)} • AI Confidence: {v.confidence.toFixed(1)}%</p>
                              {v.digital_signature && (
                                <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg w-fit group/seal cursor-help relative">
                                   <Lock className="w-3 h-3 text-emerald-600" />
                                   <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sovereign Seal Verified</span>
                                   <div className="absolute hidden group-hover/seal:block bottom-full mb-2 p-3 bg-slate-900 text-white text-[9px] font-mono rounded-xl border border-white/10 z-50 whitespace-nowrap">
                                      {v.digital_signature}
                                   </div>
                                </div>
                              )}
                           </div>
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              v.status === 'PRELIMINARY' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                           }`}>
                              {v.status}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                           {Object.entries(v.ai_assumptions).map(([key, val]: any) => (
                              <div key={key} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
                                 <p className="text-xs font-bold text-slate-700 uppercase">{val}</p>
                              </div>
                           ))}
                        </div>

                        <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex justify-between items-center">
                           <div>
                              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Preliminary AI Reserve</p>
                              <p className="text-3xl font-black text-slate-900 tracking-tighter">${(v.preliminary_reserve / 1000000).toFixed(1)}M</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expert Deviation</p>
                              <p className="text-xl font-bold text-slate-600">±0.4%</p>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           {v.status === 'PRELIMINARY' ? (
                             <button 
                               onClick={() => reviewMutation.mutate(v.id)}
                               disabled={reviewMutation.isPending}
                               className="flex-1 py-4 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl"
                             >
                                {reviewMutation.isPending ? 'Processing...' : 'Verify Valuation'} <CheckCircle className="w-4 h-4" />
                             </button>
                           ) : (
                             <div className="flex-1 py-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest border border-emerald-100">
                                <ShieldCheck className="w-4 h-4" /> Reviewed by {v.reviewed_by}
                             </div>
                           )}
                           <button className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all">
                              <Search className="w-5 h-5" />
                           </button>
                        </div>
                      </div>
                    </div>
                ))
              ) : (
                <div className="col-span-2 p-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200 text-slate-400 italic">
                   Expert peering stream active. Waiting for AI-generated reserve proposals...
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
