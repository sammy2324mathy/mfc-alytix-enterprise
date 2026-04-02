import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Users, Heart, Target, Repeat, Send, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const segments = [
  { name: 'Value Seekers', value: 34, color: '#06b6d4', avgPolicies: 1.2, ltv: '$2,400', churnRisk: 'Medium' },
  { name: 'Premium Loyal', value: 22, color: '#8b5cf6', avgPolicies: 3.1, ltv: '$12,800', churnRisk: 'Low' },
  { name: 'Young Professionals', value: 18, color: '#10b981', avgPolicies: 1.5, ltv: '$4,200', churnRisk: 'High' },
  { name: 'Family Shield', value: 16, color: '#f59e0b', avgPolicies: 2.8, ltv: '$9,600', churnRisk: 'Low' },
  { name: 'Corporate Bulk', value: 10, color: '#6366f1', avgPolicies: 45, ltv: '$85,000', churnRisk: 'Medium' },
];

export const DSCustomersPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Customer Analytics & Personalization</h2>
        <p className="text-sm text-slate-500">Behavioral clustering, lifetime value modeling, and personalized product recommendation engine.</p>
      </div>
      <button 
        onClick={() => toast.promise(new Promise(r => setTimeout(r, 2000)), {
          loading: 'Rerunning K-Means clustering...',
          success: 'Segments updated based on last 30 days behavior',
          error: 'Clustering engine failure',
        })}
        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Recalculate Segments
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Unique Customers" value="892K" trend="+8.4% YoY" trendDirection="up" icon={<Users className="w-5 h-5" />} />
      <MetricCard title="Avg Lifetime Value" value="$6,840" trend="+12% vs prior" trendDirection="up" icon={<Heart className="w-5 h-5" />} />
      <MetricCard title="Segments Identified" value="5" trend="K-Means clustering" trendDirection="neutral" icon={<Target className="w-5 h-5" />} />
      <MetricCard title="Retention Rate" value="91.2%" trend="+2.1% post-model" trendDirection="up" icon={<Repeat className="w-5 h-5" />} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Customer Segments</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segments} cx="50%" cy="50%" outerRadius={110} innerRadius={55} dataKey="value" label={({ name, value }) => `${name}: ${value}%`} labelLine={false}>
                {segments.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Segment Profiles</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Cohorts</span>
        </div>
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
            <tr><th className="px-4 py-2.5">Segment</th><th className="px-4 py-2.5 text-right font-bold">LTV</th><th className="px-4 py-2.5 text-center">Churn</th><th className="px-4 py-2.5 text-right">Action</th></tr>
          </thead>
          <tbody>
            {segments.map(s => (
              <tr key={s.name} className="border-b border-slate-100 hover:bg-slate-50 group">
                <td className="px-4 py-2.5 font-medium text-slate-800 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />{s.name}</td>
                <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">{s.ltv}</td>
                <td className="px-4 py-2.5 text-center"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${s.churnRisk === 'Low' ? 'bg-emerald-100 text-emerald-700' : s.churnRisk === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{s.churnRisk}</span></td>
                <td className="px-4 py-2.5 text-right">
                  <button 
                    onClick={() => toast.success(`Personalized campaign drafted for ${s.name} cohort`)}
                    className="p-1 text-slate-300 hover:text-indigo-600 transition-colors" 
                    title="Launch Campaign"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
