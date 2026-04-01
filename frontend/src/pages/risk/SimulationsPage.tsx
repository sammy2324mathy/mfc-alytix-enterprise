import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from 'recharts';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Activity, IterationCcw, Target, ShieldAlert } from 'lucide-react';

const generatePaths = () => {
  const data = [];
  let p1 = 100, p2 = 100, p3 = 100, p4 = 100, p5 = 100;
  for(let year = 0; year <= 10; year++) {
    data.push({ year, p1, p2, p3, p4, p5 });
    // Random walk with drift
    p1 = p1 * Math.exp(0.04 - 0.5*0.04 + 0.15 * (Math.random() - 0.5));
    p2 = p2 * Math.exp(0.04 - 0.5*0.04 + 0.15 * (Math.random() - 0.5));
    p3 = p3 * Math.exp(0.04 - 0.5*0.04 + 0.15 * (Math.random() - 0.5));
    p4 = p4 * Math.exp(0.04 - 0.5*0.04 + 0.15 * (Math.random() - 0.5));
    p5 = p5 * Math.exp(0.04 - 0.5*0.04 + 0.15 * (Math.random() - 0.5));
  }
  return data;
}

export const SimulationsPage: React.FC = () => {
  const [data, setData] = useState(generatePaths());

  const handleRun = () => {
    setData(generatePaths());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Monte Carlo Simulations</h2>
          <p className="text-sm text-slate-500">Stochastic ESG (Economic Scenario Generator) for asset pathways.</p>
        </div>
        <button 
          onClick={handleRun}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          Run 10,000 Iterations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Iterations Completed"
          value="10,000"
          trend="100%"
          trendDirection="neutral"
          description="Converged successfully"
          icon={<IterationCcw className="w-5 h-5" />}
        />
        <MetricCard
          title="Mean Ending Value"
          value="$145.2M"
          trend="+5.4%"
          trendDirection="up"
          description="Expected portfolio state"
          icon={<Target className="w-5 h-5" />}
        />
        <MetricCard
          title="Volatility (Annualized)"
          value="15.2%"
          trend="-0.5%"
          trendDirection="down"
          description="Implied by paths"
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricCard
          title="Tail Risk (CTE99)"
          value="-$24.5M"
          trend="+1.2M"
          trendDirection="down"
          description="Conditional tail expectation"
          icon={<ShieldAlert className="w-5 h-5" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Asset Path Simulations (Sample 5 of 10,000)</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `Year ${val}`} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Line type="monotone" dataKey="p1" stroke="#cbd5e1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p2" stroke="#cbd5e1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p3" stroke="#cbd5e1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p4" stroke="#818cf8" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="p5" stroke="#cbd5e1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
