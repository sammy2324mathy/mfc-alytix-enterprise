import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  BrainCircuit, 
  ShieldCheck,
  AlertCircle,
  Fingerprint,
  Lock,
  Database,
  ExternalLink,
  Info
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import { Skeleton } from '../../components/ui/Skeleton';
import { useSecurity } from '../../context/SecurityContext';

export const ProposedJournals: React.FC = () => {
  const queryClient = useQueryClient();
  const { maskData, isMaskingActive } = useSecurity();
  const { data: proposals, isLoading } = useQuery({
    queryKey: ['journal-proposals'],
    queryFn: financialApi.getJournalProposals,
  });

  const postMutation = useMutation({
    mutationFn: (id: string) => financialApi.postJournalProposal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journal-proposals'] })
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => financialApi.rejectJournalProposal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journal-proposals'] })
  });

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">AI-Proposed Adjustments</span>
           </div>
           <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Pending Postings</h2>
           <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              Complex year-end accruals and IFRS 17 adjustments initiated by the AI Financial Core for specialist review.
           </p>
        </div>
      </div>

      {/* Proposals Stream */}
      <div className="space-y-6">
        {isLoading ? (
          Array(2).fill(0).map((_, i) => <div key={i} className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-premium"><Skeleton className="h-40 w-full rounded-2xl" /></div>)
        ) : proposals && proposals.length > 0 ? (
          proposals.map((p: any) => (
            <div key={p.id} className={`bg-white rounded-[40px] border-2 transition-all overflow-hidden ${
              p.status === 'POSTED' ? 'border-emerald-100 opacity-60' : p.status === 'REJECTED' ? 'border-rose-100 opacity-60' : 'border-slate-100 shadow-premium hover:border-indigo-100'
            }`}>
               <div className="p-10">
                  <div className="flex flex-col lg:flex-row justify-between gap-10">
                     <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-indigo-600" />
                           </div>
                           <div>
                           <h3 className={`text-xl font-bold text-slate-900 ${isMaskingActive ? 'blur-[4px] select-none' : ''}`}>{maskData(p.description)}</h3>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Proposal ID: {maskData(p.id.slice(0, 8))} • AI Confidence: {p.confidence}%</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <button 
                             onClick={() => alert('Neural Evidence: Linked to Actuarial Reserve VAL-2026-X')}
                             className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                           >
                              <Database className="w-3 h-3" /> View Evidence
                           </button>
                           <button 
                             onClick={() => postMutation.mutate(p.id)}
                             disabled={p.status !== 'PROPOSED' || postMutation.isPending}
                             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                p.status === 'PROPOSED' ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-premium-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                             }`}
                           >
                              {p.status === 'PROPOSED' ? 'Approve & Hash' : 'Sealed'}
                           </button>
                        </div>
                           <div className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              p.status === 'PROPOSED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                              p.status === 'POSTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                           }`}>
                              {p.status}
                           </div>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="pb-4">Account</th>
                                    <th className="pb-4 text-right">Debit</th>
                                    <th className="pb-4 text-right">Credit</th>
                                 </tr>
                              </thead>
                              <tbody className="text-sm font-medium text-slate-700">
                                 {p.items.map((item: any, i: number) => (
                                   <tr key={i} className="border-t border-slate-200/50">
                                      <td className="py-4">{item.account}</td>
                                      <td className="py-4 text-right">{item.debit > 0 ? `$${item.debit.toLocaleString()}` : '-'}</td>
                                      <td className="py-4 text-right">{item.credit > 0 ? `$${item.credit.toLocaleString()}` : '-'}</td>
                                   </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>

                        <div className="flex gap-4 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                           <Info className="w-5 h-5 text-indigo-600 shrink-0" />
                           <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                              <span className="font-black uppercase tracking-tighter mr-2">AI Reasoning:</span>
                              {p.reasoning}
                           </p>
                        </div>
                     </div>

                     <div className="w-full lg:w-72 lg:border-l border-slate-100 lg:pl-10 flex flex-col justify-center gap-4">
                        {p.status === 'PROPOSED' ? (
                          <>
                             <button 
                               onClick={() => postMutation.mutate(p.id)}
                               disabled={postMutation.isPending}
                               className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-200 transition-all font-black text-xs uppercase tracking-widest group"
                             >
                                <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" /> Post to Ledger
                             </button>
                             <button 
                               onClick={() => rejectMutation.mutate(p.id)}
                               disabled={rejectMutation.isPending}
                               className="w-full py-4 bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-xs uppercase tracking-widest group"
                             >
                                <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> Reject Entry
                             </button>
                          </>
                        ) : p.status === 'POSTED' ? (
                          <div className="text-center space-y-3">
                             <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
                             <p className="text-sm font-black text-slate-900">TRANSACTION POSTED</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Signed off by Specialist</p>
                          </div>
                        ) : (
                          <div className="text-center space-y-3">
                             <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                             <p className="text-sm font-black text-slate-900">ENTRY REJECTED</p>
                             <span className="text-[10px] font-black text-slate-400 border border-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{p.id.slice(0, 8)}</span>
                        
                                                {p.digital_signature && (
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg group/seal cursor-help mt-4">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sovereign Seal Verified</span>
                              <div className="absolute hidden group-hover/seal:block bottom-full mb-2 p-3 bg-slate-900 text-white text-[9px] font-mono rounded-xl border border-white/10 z-50">
                                 {p.digital_signature}
                              </div>
                           </div>
                         )}
                      </div>
                   )}
                     </div>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200 text-slate-400 italic">
             Monitoring financial streams for incoming neural proposals...
          </div>
        )}
      </div>
    </div>
  );
};
