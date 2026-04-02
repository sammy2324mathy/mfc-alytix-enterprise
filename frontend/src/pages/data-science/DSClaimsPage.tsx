import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileBarChart, TrendingDown, Clock, DollarSign, BrainCircuit, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const claimsData = [
  { month: 'Jul', frequency: 412, severity: 8200 },
  { month: 'Aug', frequency: 385, severity: 7800 },
  { month: 'Sep', frequency: 445, severity: 9100 },
  { month: 'Oct', frequency: 398, severity: 8500 },
  { month: 'Nov', frequency: 468, severity: 8900 },
  { month: 'Dec', frequency: 510, severity: 9800 },
];

export const DSClaimsPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Claims Analysis & Optimization</h2>
        <p className="text-sm text-slate-500">Analyze claims data to identify cost drivers, predict severity and frequency, and optimize processing efficiency.</p>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: 'Analyzing historical severity drivers...',
            success: 'Severity coefficients updated for GBRT v2.4',
            error: 'Failed to update severity model.',
          })}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <BrainCircuit className="w-4 h-4" />
          Update Model
        </button>
        <button 
          onClick={() => toast.success('Claims triage engine optimized. Adjusted auto-approval thresholds.')}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-premium flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Optimize Triage
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Avg Claim Amount" value="$8,720" trend="+4.2% QoQ" trendDirection="down" icon={<DollarSign className="w-5 h-5" />} />
      <MetricCard title="Processing Time" value="4.2 days" trend="-1.8 days vs model" trendDirection="up" description="Automated triage" icon={<Clock className="w-5 h-5" />} />
      <MetricCard title="Cost Savings (YTD)" value="$1.4M" trend="Process optimization" trendDirection="up" icon={<TrendingDown className="w-5 h-5" />} />
      <MetricCard title="Severity Model" value="GBRT v2.4" trend="MAE: $420" trendDirection="up" icon={<FileBarChart className="w-5 h-5" />} />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Claims Frequency vs Avg Severity (6-Month Trend)</h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={claimsData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar yAxisId="left" dataKey="frequency" name="Claim Count" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={35} />
            <Bar yAxisId="right" dataKey="severity" name="Avg Severity ($)" fill="#f87171" radius={[6, 6, 0, 0]} barSize={35} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);
