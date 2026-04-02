import React, { useState } from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FlaskConical, IterationCcw, Target, Activity, ShieldAlert, Play, Settings2, ArrowRight, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const generatePaths = (n: number) => {
  const data = [];
  const paths: number[][] = Array.from({ length: n }, () => [100]);
  for (let year = 0; year <= 15; year++) {
    const point: Record<string, number> = { year };
    paths.forEach((p, i) => {
      point[`p${i}`] = parseFloat(p[year]?.toFixed(1) || '0');
      if (year < 15) {
        const next = p[year] * Math.exp(0.04 - 0.5 * 0.04 + 0.18 * (Math.random() - 0.5));
        p.push(next);
      }
    });
    data.push(point);
  }
  return data;
};

const colors = ['#818cf8', '#38bdf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb923c', '#94a3b8'];

export const SimulationsPage: React.FC = () => {
  const [pathCount, setPathCount] = useState(8);
  const [iterations, setIterations] = useState(10000);
  const [data, setData] = useState(generatePaths(pathCount));

  const handleRun = (scenarioName: string = "Standard Model Run") => {
    const loadingToast = toast.loading(`Executing Stochastic engine: ${scenarioName}...`, {
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });
    
    setTimeout(() => {
      setData(generatePaths(pathCount));
      toast.success(`${scenarioName} Complete. Paths Converged.`, {
        id: loadingToast,
        icon: <Target className="w-4 h-4 text-emerald-400" />,
        style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Simulation Laboratory</h2>
          <p className="text-sm text-slate-500">Monte Carlo stochastic engine for asset-liability pathways, economic scenarios, and uncertainty quantification.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRun} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 transition flex items-center gap-2">
            <Play className="w-4 h-4" /> Run {iterations.toLocaleString()} Iterations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Iterations" value={iterations.toLocaleString()} trend="Converged ✓" trendDirection="up" description="Full simulation" icon={<IterationCcw className="w-5 h-5" />} />
        <MetricCard title="Mean Ending Value" value="$148.7M" trend="+5.2% CAGR" trendDirection="up" description="Expected portfolio" icon={<Target className="w-5 h-5" />} />
        <MetricCard title="Annualized Vol" value="16.8%" trend="±2.1% CI" trendDirection="neutral" description="Implied by paths" icon={<Activity className="w-5 h-5" />} />
        <MetricCard title="CTE99 Tail Risk" value="-$28.3M" trend="Extreme scenario" trendDirection="down" description="Conditional tail" icon={<ShieldAlert className="w-5 h-5" />} />
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <Settings2 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-slate-800">Simulation Parameters</h3>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Iterations</label>
            <select value={iterations} onChange={e => setIterations(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm">
              <option value="1000">1,000</option>
              <option value="5000">5,000</option>
              <option value="10000">10,000</option>
              <option value="50000">50,000</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Sample Paths</label>
            <select value={pathCount} onChange={e => setPathCount(parseInt(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm">
              <option value="5">5 paths</option>
              <option value="8">8 paths</option>
              <option value="12">12 paths</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">ESG Model</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm">
              <option>Black-Scholes (GBM)</option>
              <option>Heston Stochastic Vol</option>
              <option>Jump Diffusion (Merton)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Horizon</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm">
              <option>10 Years</option>
              <option>15 Years</option>
              <option>30 Years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stress Scenarios Dashboard */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-premium">
         <div className="flex items-center gap-3 mb-8">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Stress Test Scenario & Preset Library</h3>
         </div>
         <div className="grid grid-cols-3 gap-6">
            {[
              { name: 'High Inflation Shock', desc: 'CPI +2% shock to maintenance costs.', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-indigo-50 text-indigo-600' },
              { name: 'Pandemic Mortality', desc: 'qx +25% shock to ages 65-85.', icon: <Activity className="w-4 h-4" />, color: 'bg-rose-50 text-rose-600' },
              { name: 'Market Crash V2', desc: 'Equities -30% with vol spike.', icon: <ShieldAlert className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600' },
            ].map((scen, index) => (
               <button 
                  key={index}
                  onClick={() => handleRun(scen.name)}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-left hover:border-indigo-500/50 hover:bg-white transition-all group"
               >
                  <div className={`w-10 h-10 rounded-xl ${scen.color} flex items-center justify-center mb-4 shadow-sm`}>
                     {scen.icon}
                  </div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{scen.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-2 leading-relaxed">{scen.desc}</p>
                  <div className="mt-6 flex items-center gap-2 text-indigo-600 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                     <span>Execute Scenario</span>
                     <ArrowRight className="w-3 h-3" />
                  </div>
               </button>
            ))}
         </div>
      </div>

      {/* Path Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Asset Path Simulations (Sample {pathCount} of {iterations.toLocaleString()})</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `Year ${v}`} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              {Array.from({ length: pathCount }, (_, i) => (
                <Line key={i} type="monotone" dataKey={`p${i}`} stroke={colors[i % colors.length]} strokeWidth={i === 0 ? 3 : 1.5} dot={false} opacity={i === 0 ? 1 : 0.6} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
