import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MetricCard } from '../../components/data-display/MetricCard';
import { riskApi } from '../../services/riskApi';
import { ShieldCheck, Target, BarChart3, AlertTriangle, Edit2, Loader2, Save, X } from 'lucide-react';

const appetiteMetrics = [
  { category: 'Market Risk', metric: 'VaR (99%) / Total Assets', limit: '< 5%', actual: '3.8%', status: 'Within' },
  { category: 'Credit Risk', metric: 'Counterparty Concentration', limit: '< 10% single name', actual: '7.2%', status: 'Within' },
  { category: 'Insurance Risk', metric: 'Net Retained per Life', limit: '< $500K', actual: '$420K', status: 'Within' },
  { category: 'Liquidity Risk', metric: 'Liquid Assets / ST Liabilities', limit: '> 120%', actual: '145%', status: 'Within' },
  { category: 'Operational Risk', metric: 'Op Risk Capital Charge', limit: '< 8% of SCR', actual: '9.1%', status: 'Breach' },
  { category: 'Concentration', metric: 'Top 10 Exposures / Capital', limit: '< 25%', actual: '18.5%', status: 'Within' },
];

export const RiskAppetitePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingLimit, setEditingLimit] = useState<any>(null);

  const { data: metricsRaw, isLoading } = useQuery({
    queryKey: ['risk-appetite-framework'],
    queryFn: riskApi.getRiskAppetite
  });

  const metrics = Array.isArray(metricsRaw) ? metricsRaw : [];

  const { mutate: updateLimit, isPending: isUpdating } = useMutation({
    mutationFn: (data: { id: string, value: number }) => riskApi.updateRiskLimit(data.id, data.value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-appetite-framework'] });
      setEditingLimit(null);
    }
  });

  const breaches = metrics.filter(m => m.status === 'breach').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Risk Appetite Framework</h2>
        <p className="text-sm text-slate-500">Board-approved risk tolerance limits and current utilization across all risk categories.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Risk Categories" value={metrics.length.toString()} trend="Monitored" trendDirection="neutral" icon={<ShieldCheck className="w-5 h-5" />} />
        <MetricCard title="Within Appetite" value={(metrics.length - breaches).toString()} trend={`${Math.round(((metrics.length - breaches) / (metrics.length || 1)) * 100)}% compliant`} trendDirection="up" icon={<Target className="w-5 h-5" />} />
        <MetricCard title="Breaches" value={breaches.toString()} trend="Operational risk" trendDirection="down" icon={<AlertTriangle className="w-5 h-5" />} />
        <MetricCard title="Last Board Review" value="Oct 2025" trend="Annual cycle" trendDirection="neutral" icon={<BarChart3 className="w-5 h-5" />} />
      </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-800">Appetite Utilization Dashboard</h3>
      </div>
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 font-semibold text-slate-700">Category</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Key Metric</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Board Limit</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Actual</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Status</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(m => (
            <tr key={m.limit_id} className={`border-b border-slate-100 hover:bg-slate-50 ${m.status === 'breach' ? 'bg-rose-50/50' : ''}`}>
              <td className="px-5 py-3 font-medium text-slate-800">{m.category}</td>
              <td className="px-5 py-3">{m.metric}</td>
              <td className="px-5 py-3 text-center font-mono text-xs italic">{m.board_limit}</td>
              <td className="px-5 py-3 text-center font-mono text-xs font-semibold">{m.current_value}</td>
              <td className="px-5 py-3 text-center">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  m.status === 'within' ? 'bg-emerald-100 text-emerald-700' : 
                  m.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>{m.status}</span>
              </td>
              <td className="px-5 py-3 text-right">
                <button 
                  onClick={() => setEditingLimit(m)}
                  className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-indigo-600 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingLimit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-premium w-full max-w-sm p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Update Board Limit</h4>
              <button onClick={() => setEditingLimit(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-500 mb-6">Modifying the <span className="font-bold text-slate-700">{editingLimit.category}</span> limit requires board-level calibration.</p>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Limit Value</label>
                  <input 
                    type="number" 
                    defaultValue={editingLimit.board_limit}
                    id="new-limit-input"
                    className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none" 
                  />
               </div>
               <button 
                 disabled={isUpdating}
                 onClick={() => {
                   const val = Number((document.getElementById('new-limit-input') as HTMLInputElement).value);
                   updateLimit({ id: editingLimit.limit_id, value: val });
                 }}
                 className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center justify-center gap-2"
               >
                 {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                 Recalibrate Limit
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
