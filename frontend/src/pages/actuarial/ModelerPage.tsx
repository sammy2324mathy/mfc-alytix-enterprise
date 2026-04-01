import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { FileSpreadsheet, Play, Download, Lock, TrendingUp, DollarSign, Clock, Shield } from 'lucide-react';

const projectionData = Array.from({ length: 30 }, (_, i) => {
  const year = 2025 + i;
  const premiums = 142.5 * Math.pow(1.03, i) * (1 + 0.02 * Math.sin(i * 0.5));
  const claims = premiums * (0.65 + 0.05 * Math.sin(i * 0.3));
  const reserves = claims * 0.25 * (1 + i * 0.02);
  return {
    year,
    premiums: parseFloat(premiums.toFixed(1)),
    claims: parseFloat(claims.toFixed(1)),
    reserves: parseFloat(reserves.toFixed(1)),
    netCashFlow: parseFloat((premiums - claims - reserves * 0.1).toFixed(1)),
  };
});

export const ModelerPage: React.FC = () => {
  const { user } = useAuthStore();
  const isChief = user?.roles.includes('chief_actuary') || user?.roles.includes('admin');
  const [scenario, setScenario] = useState('base');
  const [discountRate, setDiscountRate] = useState(4.5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cash Flow Modeler</h2>
          <p className="text-sm text-slate-500">Project policy values, liabilities, and cash flows under deterministic scenarios. Excel-grade precision with enterprise scale.</p>
        </div>
        <div className="flex gap-3">
          <select value={scenario} onChange={e => setScenario(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-indigo-500 focus:border-indigo-500">
            <option value="base">Base Case</option>
            <option value="adverse">Adverse Scenario</option>
            <option value="favorable">Favorable Scenario</option>
            <option value="stress">1-in-200 Year Stress</option>
          </select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2">
            <Play className="w-4 h-4" /> Run Projection
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Present Value of Liabilities" value="$2.14B" trend="+1.8%" trendDirection="down" description="Discounted at 4.5%" icon={<DollarSign className="w-5 h-5" />} />
        <MetricCard title="Best Estimate Reserves" value="$485.2M" trend="+3.1%" trendDirection="neutral" description="IFRS 17 compliant" icon={<Shield className="w-5 h-5" />} />
        <MetricCard title="Risk Adjustment" value="$42.8M" trend="6.8% of BEL" trendDirection="neutral" description="Confidence level: 85%" icon={<TrendingUp className="w-5 h-5" />} />
        <MetricCard title="Projection Horizon" value="30 Years" trend="2025–2054" trendDirection="neutral" description="Annual time steps" icon={<Clock className="w-5 h-5" />} />
      </div>

      {/* Assumptions Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Projection Assumptions</h3>
          </div>
          <button className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Export to Excel</button>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex justify-between">
              <span>Discount Rate</span>
              <span className="text-indigo-600 font-mono">{discountRate}%</span>
            </label>
            <input type="range" min="1" max="10" step="0.1" value={discountRate} onChange={e => setDiscountRate(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mortality Table</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white">
              <option>SA85-90 (Ultimate)</option>
              <option>UK Assured Lives 00-02</option>
              <option>CSO 2017</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Lapse Rate Basis</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white">
              <option>Experience Based (5-yr avg)</option>
              <option>Industry Standard</option>
              <option>Dynamic (macro-linked)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Expense Inflation</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white">
              <option>CPI + 1% (5.8%)</option>
              <option>Flat 4%</option>
              <option>Salary Linked (7%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Projected Cash Flows ($M)</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`$${value}M`]} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="premiums" name="Premium Income" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="claims" name="Claims Outgo" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="reserves" name="Reserve Build" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
              <Line type="monotone" dataKey="netCashFlow" name="Net Cash Flow" stroke="#6366f1" strokeWidth={3} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
