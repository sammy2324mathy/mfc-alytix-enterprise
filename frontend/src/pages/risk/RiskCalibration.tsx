import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ShieldAlert, 
  Settings2, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Fingerprint,
  Info,
  Sliders,
  Lock
} from 'lucide-react';
import { riskApi } from '../../services/riskApi';
import { Skeleton } from '../../components/ui/Skeleton';

export const RiskCalibration: React.FC = () => {
  const queryClient = useQueryClient();
  const [calibrations, setCalibrations] = useState<Record<string, number>>({});

  const { data: proposals, isLoading } = useQuery({
    queryKey: ['risk-limit-proposals'],
    queryFn: riskApi.getRiskLimitProposals,
  });

  const calibrateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string, value: number }) => riskApi.calibrateRiskLimit(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-limit-proposals'] });
    }
  });

  const handleSliderChange = (id: string, value: number) => {
    setCalibrations(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-5 h-5 text-rose-600" />
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em]">AI-Prescribed Risk Limits</span>
           </div>
           <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Limit Calibration</h2>
           <p className="text-slate-500 mt-2 text-base font-medium max-w-2xl">
              Calibrate and sign-off on risk limits prescribed by the autonomous engine. Expert oversight required for capital and VaR thresholds.
           </p>
        </div>
      </div>

      {/* Calibration Stream */}
      <div className="space-y-8">
        {isLoading ? (
          Array(2).fill(0).map((_, i) => <div key={i} className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-premium"><Skeleton className="h-56 w-full rounded-2xl" /></div>)
        ) : proposals && proposals.length > 0 ? (
          proposals.map((p: any) => (
            <div key={p.id} className={`bg-white rounded-[40px] border-2 transition-all p-10 ${
              p.status === 'CALIBRATED' ? 'border-emerald-100 opacity-60' : 'border-slate-100 shadow-premium'
            }`}>
               <div className="flex flex-col xl:flex-row gap-12">
                  <div className="flex-1">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                           <ShieldAlert className="w-8 h-8 text-rose-600" />
                        </div>
                        <div>
                           <h3 className="text-2xl font-bold text-slate-900">{p.metric}</h3>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">ID: {p.id.slice(0, 8)} • AI Confidence: {p.confidence.toFixed(1)}%</p>
                           {p.digital_signature && (
                              <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg w-fit group/seal cursor-help relative">
                                 <Lock className="w-3 h-3 text-emerald-600" />
                                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Sovereign Seal Verified</span>
                                 <div className="absolute hidden group-hover/seal:block bottom-full mb-2 p-3 bg-slate-900 text-white text-[9px] font-mono rounded-xl border border-white/10 z-50 whitespace-nowrap">
                                    {p.digital_signature}
                                 </div>
                              </div>
                           )}
                        </div>
                        <div className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                           p.status === 'PROPOSED' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                           {p.status}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Prescriptive Reasoning</p>
                           <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{p.reasoning}"</p>
                           <div className="mt-4 flex gap-3 p-4 bg-white rounded-2xl border border-slate-200">
                              <Info className="w-5 h-5 text-indigo-600 shrink-0" />
                              <p className="text-xs text-slate-500 font-medium">{p.neural_context}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="w-full xl:w-[400px] xl:border-l border-slate-100 xl:pl-12 flex flex-col justify-between">
                     {p.status === 'PROPOSED' ? (
                        <div className="space-y-8">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current</p>
                                 <p className="text-lg font-black text-slate-900">${(p.current_limit / 1000000).toFixed(1)}M</p>
                              </div>
                              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">AI Proposed</p>
                                 <p className="text-lg font-black text-indigo-900">${(p.proposed_limit / 1000000).toFixed(1)}M</p>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <div className="flex justify-between items-end">
                                 <p className="text-sm font-bold text-slate-700">Specialist Calibration</p>
                                 <p className="text-xl font-black text-rose-600">${((calibrations[p.id] || p.proposed_limit) / 1000000).toFixed(1)}M</p>
                              </div>
                              <input 
                                type="range" 
                                min={p.current_limit * 0.5} 
                                max={p.proposed_limit * 1.5} 
                                step={100000}
                                value={calibrations[p.id] || p.proposed_limit}
                                onChange={(e) => handleSliderChange(p.id, parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
                              />
                           </div>

                           <button 
                             onClick={() => calibrateMutation.mutate({ id: p.id, value: calibrations[p.id] || p.proposed_limit })}
                             disabled={calibrateMutation.isPending}
                             className="w-full py-5 bg-slate-900 text-white rounded-[24px] flex items-center justify-center gap-3 shadow-xl hover:bg-rose-600 transition-all font-black text-xs uppercase tracking-widest group"
                           >
                              {calibrateMutation.isPending ? 'Processing...' : 'Apply & Sign-off'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                           <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
                              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-900 uppercase">Limit Calibrated</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Specialist: {p.calibrated_by}</p>
                              <p className="text-2xl font-black text-emerald-600 tracking-tighter mt-4">${(p.calibrated_limit / 1000000).toFixed(1)}M</p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200 text-slate-400 italic">
             Monitoring risk streams for incoming neural prescriptive proposals...
          </div>
        )}
      </div>
    </div>
  );
};
