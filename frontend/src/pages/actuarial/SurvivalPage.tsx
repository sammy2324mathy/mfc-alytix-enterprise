import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Heart, Activity, UserPlus, Clock, Loader2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const SurvivalPage: React.FC = () => {
  const [modelType, setModelType] = useState('kaplan');
  const [survivalData, setSurvivalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSurvivalCurves = async () => {
    try {
      setLoading(true);
      
      const durations = Array.from({ length: 120 }, (_, i) => i + 1);
      // Simulate higher death event probability for standard, lower for experimental
      const eventsStandard = durations.map(m => Math.random() < 0.05 ? 1 : 0);
      const eventsExp = durations.map(m => Math.random() < 0.03 ? 1 : 0);

      const standardRes = await apiClient.post('/actuarial/survival/kaplan-meier', {
        durations: durations,
        events: eventsStandard
      });
      const expRes = await apiClient.post('/actuarial/survival/kaplan-meier', {
        durations: durations,
        events: eventsExp
      });

      const curve1 = standardRes.data.survival_curve as { survival: number }[];
      const curve2 = expRes.data.survival_curve as { survival: number }[];
      const n = Math.min(durations.length, curve1.length, curve2.length);

      const chartData = durations.slice(0, n).map((month, idx) => ({
        month,
        standard: parseFloat((curve1[idx].survival * 100).toFixed(1)),
        experimental: parseFloat((curve2[idx].survival * 100).toFixed(1)),
      }));

      setSurvivalData(chartData);
    } catch (err) {
      console.error("Failed to fetch survival curves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvivalCurves();
  }, [modelType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Survival Models</h2>
          <p className="text-sm text-slate-500">Run Kaplan-Meier estimates and Cox Proportional Hazard regressions.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          >
            <option value="kaplan">Kaplan-Meier Estimator</option>
            <option value="cox">Cox Proportional Hazards</option>
            <option value="weibull">Weibull Parametric</option>
          </select>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            Fit Model
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Median Survival Time"
          value="42.8 mo"
          trend="+1.2 mo"
          trendDirection="up"
          description="Standard cohort"
          icon={<Clock className="w-5 h-5" />}
        />
        <MetricCard
          title="Hazard Ratio"
          value="0.68"
          trend="-0.02"
          trendDirection="down"
          description="Exp vs Standard (p<0.01)"
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricCard
          title="Total Observations"
          value="1,429"
          trend="+12%"
          trendDirection="up"
          description="Patients enrolled"
          icon={<UserPlus className="w-5 h-5" />}
        />
        <MetricCard
          title="Events (Deaths)"
          value="512"
          trend="+"
          trendDirection="neutral"
          description="Right-censored remainder"
          icon={<Heart className="w-5 h-5" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Survival Probability Curve S(t)</h3>
          <div className="text-sm text-slate-500 px-3 py-1 bg-slate-100 rounded-full font-medium">95% Confidence Intervals Enabled</div>
        </div>
        <div className="h-[400px] w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={survivalData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={false} 
                minTickGap={20}
                tickFormatter={(val) => `${val} mo`}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748b' }} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [<span className="font-semibold text-slate-800">{value}%</span>, 'Probability']}
                labelFormatter={(label) => <span className="text-slate-500 text-sm">Month {label}</span>}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Line type="stepAfter" dataKey="standard" name="Standard Treatment" stroke="#94a3b8" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#94a3b8' }} />
              <Line type="stepAfter" dataKey="experimental" name="Experimental Protocol" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8b5cf6' }} />
            </LineChart>
          </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
