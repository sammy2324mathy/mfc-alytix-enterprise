import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Zap, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  Fingerprint
} from 'lucide-react';
import { 
  financialApi, 
} from '../../services/financialApi';
import { actuarialApi } from '../../services/actuarialApi';
import { riskApi } from '../../services/riskApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Skeleton } from '../../components/ui/Skeleton';

export const AutonomousHub: React.FC = () => {
  const { data: accountingDecisions, isLoading: loadingInvoices } = useQuery({
    queryKey: ['autonomous-decisions'],
    queryFn: financialApi.getAutonomousDecisions,
    refetchInterval: 5000
  });

  const { data: claimsDecisions, isLoading: loadingClaims } = useQuery({
    queryKey: ['claims-autonomous-decisions'],
    queryFn: actuarialApi.getAutonomousClaimsDecisions,
    refetchInterval: 5000
  });

  const { data: journalProposals } = useQuery({
    queryKey: ['journal-proposals'],
    queryFn: financialApi.getJournalProposals,
  });

  const { data: valuations } = useQuery({
    queryKey: ['liability-valuations'],
    queryFn: actuarialApi.getLiabilityValuations,
  });

  const { data: riskProposals } = useQuery({
    queryKey: ['risk-limit-proposals'],
    queryFn: riskApi.getRiskLimitProposals,
  });

  const isLoading = loadingInvoices || loadingClaims;

  const allDecisions = [
    ...(accountingDecisions || []).map(d => ({ ...d, type: 'INVOICE' })),
    ...(claimsDecisions || []).map((d: any) => ({ ...d, type: 'CLAIM', invoice_id: d.claim_id, can_approve: d.payout_triggered }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const pendingJournals = journalProposals?.filter((p: any) => p.status === 'PROPOSED').length || 0;
  const pendingValuations = valuations?.filter((v: any) => v.status === 'PRELIMINARY').length || 0;
  const pendingRisk = riskProposals?.filter((p: any) => p.status === 'PROPOSED').length || 0;
  const flaggedClaims = claimsDecisions?.filter((d: any) => !d.payout_triggered).length || 0;

  const totalPendingExpertReview = pendingJournals + pendingValuations + pendingRisk + flaggedClaims;

  const avgConfidence = allDecisions.length 
    ? (allDecisions.reduce((acc, d) => acc + d.confidence, 0) / allDecisions.length).toFixed(1) 
    : "98.4";

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Autonomous Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Autonomous Governance Active</span>
           </div>
           <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Executive Intelligence Hub</h2>
           <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              Monitoring the zero-human autonomous decision engine. The AI is currently managing Accounts Receivable, Actuarial Reserves, and Digital Sign-offs.
           </p>
        </div>
        <div className="flex items-center gap-4 bg-indigo-50/50 border border-indigo-100 p-4 rounded-3xl">
           <Cpu className="w-10 h-10 text-indigo-600 animate-pulse" />
           <div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Active Neural Engine</p>
              <p className="text-sm font-black text-indigo-900">v4.2 Managed-Services</p>
           </div>
        </div>
      </div>

      {/* Autonomous KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="System Decisions" value={(allDecisions?.length || 412).toString()} trend="+8.4%" trendDirection="up" description="Autonomous actions executed" icon={<Activity className="w-5 h-5 text-indigo-500" />} />
        <MetricCard title="Avg AI Confidence" value={`${avgConfidence}%`} trend="Optimal" trendDirection="up" description="Decision integrity score" icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="Pending Expert Review" value={totalPendingExpertReview.toString()} trend="Requires Oversight" trendDirection="neutral" description="Complex cases flagged" icon={<Fingerprint className="w-5 h-5 text-rose-500" />} />
        <MetricCard title="Autonomous Velocity" value="1.2s" trend="Real-time" trendDirection="up" description="Decision cycle time" icon={<Timer className="w-5 h-5 text-indigo-500" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Live Decision Stream */}
        <div className="lg:col-span-2 bg-white rounded-[40px] shadow-premium border border-slate-100 overflow-hidden">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <Zap className="w-6 h-6 text-indigo-600" />
                 <h3 className="text-xl font-bold text-slate-900">Neural Decision Stream</h3>
              </div>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest flex items-center gap-2">
                 Audit Raw Logs <ArrowRight className="w-4 h-4" />
              </button>
           </div>
           
           <div className="divide-y divide-slate-100">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <div key={i} className="p-8"><Skeleton className="h-12 w-full rounded-2xl" /></div>)
              ) : allDecisions && allDecisions.length > 0 ? (
                allDecisions.map((d: any, i: number) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center border-2 transition-all ${
                          d.can_approve ? 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:scale-110' : 'bg-rose-50 border-rose-100 text-rose-600 group-hover:shake'
                        }`}>
                           {d.can_approve ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <span className="text-base font-bold text-slate-900">
                                {d.type === 'INVOICE' ? 'Autonomous Invoice Approval' : 'Autonomous Claim Adjudication'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-bold">#{d.invoice_id}</span>
                           </div>
                           <p className="text-sm text-slate-500 mt-1 font-medium italic">"{d.reason}"</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-lg font-black ${d.confidence >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                           {d.confidence.toFixed(1)}%
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI Confidence</p>
                     </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center space-y-4">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                      <Zap className="w-8 h-8 text-slate-200" />
                   </div>
                   <div>
                      <p className="text-lg font-bold text-slate-900">Waiting for Autonomous Context</p>
                      <p className="text-sm text-slate-500">The Neural Engine is currently monitoring the ledgers for incoming transactions.</p>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Expert Intervention Queue (Hybrid Node) */}
        <div className="space-y-8">
           <div className="bg-white rounded-[40px] shadow-premium border-2 border-rose-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                 <Fingerprint className="w-6 h-6 text-rose-600" /> Expert Intervention
              </h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">Cases flagged for complexity. Redirection to the remaining department specialists for final adjudication.</p>
              
              <div className="space-y-4">
                 {allDecisions.filter(d => !d.can_approve).slice(0, 3).map((item, i) => (
                   <div key={i} className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl group hover:bg-rose-50 transition-all flex justify-between items-center">
                      <div>
                         <p className="text-xs font-bold text-slate-900">{item.type} Adjudication</p>
                         <p className="text-[10px] text-rose-600 font-bold uppercase mt-1">Confidence: {item.confidence.toFixed(1)}%</p>
                      </div>
                      <button className="p-2 bg-white border border-rose-200 rounded-xl text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                         <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                 ))}
                 {flaggedClaims === 0 && (
                   <div className="text-center py-6 text-slate-400 italic text-sm">
                      No cases currently require expert human oversight.
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[40px] p-8 text-white shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-white/10 transition-all duration-700" />
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6 text-indigo-400" /> Digital Sign-offs
              </h3>
              <div className="space-y-6">
                 {[
                   { label: 'IFRS 17 Valuation', status: 'AI SIGNED', date: 'Just now' },
                   { label: 'Quarterly Reserved', status: 'AI SIGNED', date: '2m ago' },
                   { label: 'Tax Commitment', status: 'PENDING AI', date: 'Monitoring' },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded-2xl group/item hover:bg-white/10 transition-all">
                      <div>
                         <p className="text-sm font-bold">{item.label}</p>
                         <p className="text-[10px] text-white/50 mt-1 uppercase font-black tracking-widest">{item.date}</p>
                      </div>
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border ${
                        item.status === 'AI SIGNED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30 animate-pulse'
                      }`}>
                         {item.status}
                      </span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[40px] p-8 shadow-premium border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                 <Bot className="w-8 h-8 text-indigo-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Neural Thresholds</h4>
              <p className="text-sm text-slate-500 mt-2 mb-8 font-medium">Confidence required for zero-human execution across all modules.</p>
              
              <div className="w-full space-y-6 text-left">
                 <div>
                    <div className="flex justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Confidence</span>
                       <span className="text-[10px] font-black text-indigo-600 uppercase">95.0%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full w-[95%] bg-indigo-600 rounded-full" />
                    </div>
                 </div>
              </div>
              
              <button className="w-full mt-8 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-600 hover:bg-white hover:border-indigo-100 hover:text-indigo-600 hover:shadow-premium-sm transition-all">
                 Adjust Autonomous Parameters
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const Bot = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
