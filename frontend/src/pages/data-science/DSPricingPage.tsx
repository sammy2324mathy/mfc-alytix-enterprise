import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, Target, BarChart3, Wand2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

const pricingHistory = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  modelPremium: 1200 + Math.round(Math.sin(i * 0.5) * 150 + i * 20),
  actualPremium: 1250 + Math.round(Math.sin(i * 0.5) * 120 + i * 18),
  competitor: 1180 + Math.round(i * 25),
}));

export const DSPricingPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Pricing & Premium Optimization</h2>
        <p className="text-sm text-slate-500">ML-driven pricing models that use historical claims data to optimize premiums while remaining competitive.</p>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => toast.success('Market analysis triggered. Analyzing competitor premiums...')}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Market Intelligence
        </button>
        <button 
          onClick={() => toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: 'Recalculating optimal premiums...',
            success: 'Premium optimization complete. Applied to v3.1 model.',
            error: 'Failed to optimize premiums.',
          })}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-premium flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          Optimize All
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Pricing Model" value="GLM + RF Ensemble" trend="v3.1 (Prod)" trendDirection="up" icon={<DollarSign className="w-5 h-5" />} />
      <MetricCard title="Price Elasticity" value="-0.42" trend="Inelastic demand" trendDirection="neutral" icon={<TrendingUp className="w-5 h-5" />} />
      <MetricCard title="Premium Accuracy" value="94.1%" trend="vs actual claims ratio" trendDirection="up" icon={<Target className="w-5 h-5" />} />
      <MetricCard title="Revenue Impact" value="+$3.2M" trend="vs prior model" trendDirection="up" icon={<BarChart3 className="w-5 h-5" />} />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Model Premium vs Actual vs Competitor ($)</h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={pricingHistory} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`$${value}`]} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="modelPremium" name="Model Premium" stroke="#06b6d4" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="actualPremium" name="Actual Premium" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="competitor" name="Competitor Avg" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);
