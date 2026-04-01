import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { MetricCard } from '../../components/data-display/MetricCard';
import { AlertTriangle, Target, BarChart3, ShieldCheck, Send, Lock, CheckCircle, XCircle, FileSignature, Settings2 } from 'lucide-react';

const lossDistributionData = Array.from({ length: 100 }, (_, i) => {
  const loss = (i * 2) - 50;
  const prob = Math.exp(-0.5 * Math.pow((loss - 20) / 30, 2)) * 100;
  return { lossAmount: loss, probability: parseFloat(prob.toFixed(2)) };
});

type LimitStatus = 'Draft' | 'Pending CRO Approval' | 'Enacted' | 'Rejected';

interface VarLimitProposal {
  id: string;
  date: string;
  metric: string;
  currentValue: string;
  proposedValue: string;
  rationale: string;
  submittedBy: string;
  status: LimitStatus;
}

export const MetricsPage: React.FC = () => {
  const { user } = useAuthStore();
  const isCRO = user?.roles.includes('admin') || user?.roles.includes('cro') || user?.roles.includes('chief_actuary');
  const isAnalyst = user?.roles.includes('risk_analyst') || user?.roles.includes('actuarial_analyst') || isCRO;
  const username = isCRO ? 'Chief Risk Officer' : 'Risk Analyst';

  const [proposals, setProposals] = useState<VarLimitProposal[]>([
    { id: 'LIM-301', date: '2025-11-15', metric: 'VaR Confidence Level', currentValue: '99.5%', proposedValue: '99.9%', rationale: 'EIOPA stress test feedback requires tighter tail calibration', submittedBy: 'Risk Analyst', status: 'Pending CRO Approval' },
    { id: 'LIM-298', date: '2025-10-01', metric: 'Economic Capital Buffer', currentValue: '15%', proposedValue: '20%', rationale: 'Board risk appetite review — increased minimum solvency cushion', submittedBy: 'Chief Risk Officer', status: 'Enacted' },
  ]);

  const [isDrafting, setIsDrafting] = useState(false);
  const [draftMetric, setDraftMetric] = useState('VaR Confidence Level');
  const [draftProposed, setDraftProposed] = useState('');
  const [draftRationale, setDraftRationale] = useState('');

  const handleSubmitProposal = (toCRO: boolean) => {
    if (!draftProposed) return;
    const currentMap: Record<string, string> = {
      'VaR Confidence Level': '99.5%',
      'Expected Shortfall Threshold': '$112.5M',
      'Economic Capital Buffer': '15%',
      'Solvency Ratio Floor': '200%'
    };
    const newProposal: VarLimitProposal = {
      id: `LIM-${Math.floor(300 + Math.random() * 700)}`,
      date: new Date().toISOString().split('T')[0],
      metric: draftMetric,
      currentValue: currentMap[draftMetric] || 'N/A',
      proposedValue: draftProposed,
      rationale: draftRationale,
      submittedBy: username,
      status: toCRO ? 'Pending CRO Approval' : 'Draft'
    };
    setProposals([newProposal, ...proposals]);
    setIsDrafting(false);
    setDraftProposed('');
    setDraftRationale('');
  };

  const updateProposalStatus = (id: string, newStatus: LimitStatus) => {
    setProposals(proposals.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Enterprise Risk Metrics & Limit Governance</h2>
          <p className="text-sm text-slate-500">
            VaR engine outputs, limit proposals, and CRO governance. Analysts draft impact studies; CRO enacts parameter changes.
          </p>
        </div>
        <div className="flex gap-3">
          {!isDrafting && (
            <button onClick={() => setIsDrafting(true)} className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-sky-700 transition flex items-center gap-2">
              <FileSignature className="w-4 h-4" /> Propose Limit Change
            </button>
          )}
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors shadow-sm">
            Recalculate VaR Engine
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Value at Risk (99.5%)" value="$84.2M" trend="+1.2M" trendDirection="down" description="1-Year Horizon" icon={<AlertTriangle className="w-5 h-5" />} />
        <MetricCard title="Expected Shortfall" value="$112.5M" trend="+3.4M" trendDirection="down" description="Average loss beyond VaR" icon={<Target className="w-5 h-5" />} />
        <MetricCard title="Economic Capital" value="$150.0M" trend="Stable" trendDirection="neutral" description="Internal model" icon={<ShieldCheck className="w-5 h-5" />} />
        <MetricCard title="Solvency Ratio" value="215%" trend="-5%" trendDirection="down" description="Assets / Required Capital" icon={<BarChart3 className="w-5 h-5" />} />
      </div>

      {isDrafting && (
        <div className="bg-white rounded-xl shadow-lg border border-sky-100 overflow-hidden ring-1 ring-sky-100">
          <div className="p-5 border-b border-sky-100 bg-sky-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-sky-900 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-sky-600" /> Risk Limit Impact Study
            </h3>
            <button onClick={() => setIsDrafting(false)} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Cancel</button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Risk Parameter</label>
              <select value={draftMetric} onChange={e => setDraftMetric(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500">
                <option>VaR Confidence Level</option>
                <option>Expected Shortfall Threshold</option>
                <option>Economic Capital Buffer</option>
                <option>Solvency Ratio Floor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proposed New Value</label>
              <input type="text" value={draftProposed} onChange={e => setDraftProposed(e.target.value)} placeholder="e.g. 99.9% or $120M" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Impact Rationale & Supporting Analysis</label>
              <textarea rows={2} value={draftRationale} onChange={e => setDraftRationale(e.target.value)} placeholder="Reference stress test results, regulatory guidance, or board risk appetite statement..." className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
            <div className="md:col-span-3 flex justify-end gap-3 pt-2">
              <button onClick={() => handleSubmitProposal(false)} disabled={!draftProposed} className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-semibold flex items-center gap-2">
                Save Draft
              </button>
              <button onClick={() => handleSubmitProposal(true)} disabled={!draftProposed} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2">
                <Send className="w-4 h-4" /> Submit for CRO Sign-off
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Limit Governance Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Risk Limit Governance Queue</h3>
          {!isCRO && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Enactment Authority: CRO Only
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Proposal ID</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Metric</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Current → Proposed</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Rationale</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">CRO Actions</th>
              </tr>
            </thead>
            <tbody>
              {proposals.map((prop) => (
                <tr key={prop.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">
                    <div>{prop.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">by {prop.submittedBy}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{prop.metric}</td>
                  <td className="px-6 py-4 font-mono text-sm">
                    <span className="text-slate-400">{prop.currentValue}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <span className="text-sky-700 font-semibold">{prop.proposedValue}</span>
                  </td>
                  <td className="px-6 py-4 text-xs max-w-[200px] truncate" title={prop.rationale}>{prop.rationale}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      prop.status === 'Enacted' ? 'bg-emerald-100 text-emerald-700' :
                      prop.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                      prop.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>{prop.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {prop.status === 'Pending CRO Approval' ? (
                      isCRO ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateProposalStatus(prop.id, 'Enacted')} className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-xs font-semibold shadow-sm flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Enact
                          </button>
                          <button onClick={() => updateProposalStatus(prop.id, 'Rejected')} className="text-rose-600 hover:text-rose-800 bg-rose-50 px-2 rounded transition-colors">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] italic text-slate-400 flex items-center justify-end gap-1"><Lock className="w-3 h-3" /> CRO Only</span>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VaR Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Aggregate Loss Distribution</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lossDistributionData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorProb" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.8}/>
                  <stop offset="90%" stopColor="#ef4444" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="lossAmount" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}M`} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 'dataMax + 20']} hide={true} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [value, 'Density']} labelFormatter={(label) => `Loss: $${label}M`} />
              <ReferenceLine x={84} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: '99.5% VaR: $84.2M', fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="probability" stroke="url(#colorProb)" fillOpacity={1} fill="url(#colorProb)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
