import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { MetricCard } from '../../components/data-display/MetricCard';
import { actuarialApi } from '../../services/actuarialApi';
import { Calculator, TrendingUp, Layers, CheckCircle, FileSignature, Send, Lock, RotateCcw, Save, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const premiumComponents = [
  { product: 'Term Life', risk: 45, expenses: 15, margin: 10 },
  { product: 'Whole Life', risk: 120, expenses: 40, margin: 30 },
  { product: 'Universal Life', risk: 80, expenses: 25, margin: 20 },
  { product: 'Annuity', risk: 180, expenses: 30, margin: 45 },
];

const initialRateHistory = [
  { quarter: '2023 Q3', rateChange: -0.5 },
  { quarter: '2023 Q4', rateChange: 3.2 },
  { quarter: '2024 Q1', rateChange: 1.1 },
  { quarter: '2024 Q2', rateChange: 0.8 },
];

type ProposalStatus = 'Draft' | 'Pending Review' | 'Committed to Engine' | 'Rejected';

interface RateProposal {
  id: string;
  date: string;
  product: string;
  currentRate: number;
  proposedDelta: number;
  justification: string;
  analyst: string;
  status: ProposalStatus;
}

export const PricingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const isChief = user?.roles.includes('admin') || user?.roles.includes('chief_actuary');
  const isAnalyst = user?.roles.includes('actuarial_analyst') || isChief; 
  const username = user?.roles.includes('admin') ? 'System Admin' : 
                   user?.roles.includes('chief_actuary') ? 'Chief Actuary' : 
                   user?.roles.includes('actuarial_analyst') ? 'Pricing Analyst' : 'Viewer';

  const { data: proposalsRaw, isLoading: loadingProposals } = useQuery({
    queryKey: ['pricing-proposals'],
    queryFn: actuarialApi.getRateProposals
  });

  const proposals = Array.isArray(proposalsRaw) ? proposalsRaw : [];

  const [rateHistory, setRateHistory] = useState(initialRateHistory);

  // Draft State
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftProduct, setDraftProduct] = useState('Whole Life');
  const [draftDelta, setDraftDelta] = useState<number>(0);
  const [draftJustification, setDraftJustification] = useState('');

  const { mutate: handleSaveProposal, isPending: isSaving } = useMutation({
    mutationFn: (data: { product: string; proposedDelta: number; justification: string; status: string }) => 
      actuarialApi.createRateProposal({ ...data, analyst: username }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pricing-proposals'] });
      setIsDrafting(false);
      setDraftDelta(0);
      setDraftJustification('');
      
      const isPending = variables.status === 'Pending Review';
      toast.success(isPending ? 'Rate Proposal Broadcasted to Chief Actuary' : 'Pricing Logic Saved to Drafts', {
        icon: isPending ? <Send className="w-4 h-4 text-indigo-400" /> : <Save className="w-4 h-4 text-slate-400" />,
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
      });
    }
  });

  const { mutate: updateProposalStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => actuarialApi.updateRateProposalStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['pricing-proposals'] });
      if (updated.status === 'Committed to Engine') {
        setRateHistory(prev => [...prev, { quarter: 'Latest', rateChange: updated.proposedDelta }]);
        toast.success(`Operationalizing: ${updated.product} rates updated by ${updated.proposedDelta}%`, {
           icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
           style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
        });
      } else if (updated.status === 'Rejected') {
        toast.error('Pricing Proposal Rejected', {
          style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
        });
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Actuarial Rating Engine</h2>
          <p className="text-sm text-slate-500">Draft rate changes, review pricing indications, and commit production engine updates.</p>
        </div>
        <div className="flex gap-3">
          {(!isDrafting) && (
            <button 
              onClick={() => setIsDrafting(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <FileSignature className="w-4 h-4" /> Propose Rate Change
            </button>
          )}
        </div>
      </div>

      {isDrafting && (
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden ring-1 ring-indigo-100">
          <div className="p-5 border-b border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600"/> New Pricing Study
            </h3>
            <button onClick={() => setIsDrafting(false)} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Cancel Analysis</button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Portfolio</label>
              <select 
                value={draftProduct} onChange={e => setDraftProduct(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {premiumComponents.map(p => <option key={p.product} value={p.product}>{p.product}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proposed Base Rate Delta (%)</label>
              <input 
                type="number" step="0.1" value={draftDelta} onChange={e => setDraftDelta(parseFloat(e.target.value) || 0)} 
                className={`w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono ${draftDelta > 0 ? 'text-rose-600' : draftDelta < 0 ? 'text-emerald-600' : ''} focus:ring-indigo-500 focus:border-indigo-500`} 
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Actuarial Justification & Experience Study Link</label>
              <textarea 
                rows={2} placeholder="Detail GLM indication factors, credibilities, or competitor benchmarking..."
                value={draftJustification} onChange={e => setDraftJustification(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
               <button 
                 onClick={() => handleSaveProposal({ product: draftProduct, proposedDelta: draftDelta, justification: draftJustification, status: 'Draft' })} 
                 disabled={draftDelta === 0 || isSaving} 
                 className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-semibold flex items-center gap-2"
               >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4"/>}
                 Save Analysis Draft
               </button>
               <button 
                 onClick={() => handleSaveProposal({ product: draftProduct, proposedDelta: draftDelta, justification: draftJustification, status: 'Pending Review' })} 
                 disabled={draftDelta === 0 || isSaving} 
                 className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
               >
                 {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4"/>}
                 Submit for Chief Actuary Review
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Workflows Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Rate Change Proposals Queue</h3>
          {!isChief && (
             <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
               <Lock className="w-3 h-3" /> Commit Authority Restricted
             </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Proposal ID</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Portfolio</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Justification</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Delta (%)</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Chief Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((prop) => (
                <tr key={prop.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900 group">
                    <div>{prop.id}</div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">by {prop.analyst}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{prop.product}</td>
                  <td className="px-6 py-4 text-xs max-w-[250px] truncate" title={prop.justification}>{prop.justification}</td>
                  <td className={`px-6 py-4 text-right font-mono font-medium ${prop.proposedDelta > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {prop.proposedDelta > 0 ? '+' : ''}{prop.proposedDelta}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      prop.status === 'Committed to Engine' ? 'bg-indigo-100 text-indigo-700' :
                      prop.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                      prop.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {prop.status === 'Pending Review' ? (
                      isChief ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateProposalStatus({ id: prop.id, status: 'Committed to Engine' })} 
                            disabled={isUpdating}
                            className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors flex items-center gap-1" 
                            title="Approve & Deploy Rate"
                          >
                            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5"/>}
                            Commit
                          </button>
                          <button 
                            onClick={() => updateProposalStatus({ id: prop.id, status: 'Rejected' })} 
                            disabled={isUpdating}
                            className="text-rose-600 hover:text-rose-800 bg-rose-50 px-2 rounded transition-colors" 
                            title="Reject"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] italic text-slate-400 flex items-center justify-end gap-1"><Lock className="w-3 h-3"/> Locked</span>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-500"/> Current Base Premium Components ($)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={premiumComponents} margin={{ top: 5, right: 30, left: 0, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis dataKey="product" type="category" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} width={80} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`$${value}`, undefined]} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="risk" name="Pure Risk Premium" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses & Commissions" stackId="a" fill="#818cf8" />
                <Bar dataKey="margin" name="Profit Margin" stackId="a" fill="#a5b4fc" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500"/> Engine Rate Change History (%)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rateHistory} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`${Number(value) > 0 ? '+' : ''}${value}%`, 'Global Index']} />
                <Line type="stepAfter" dataKey="rateChange" name="Base Rate Deployment" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
