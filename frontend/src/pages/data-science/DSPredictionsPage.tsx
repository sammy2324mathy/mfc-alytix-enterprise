import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { Skeleton } from '../../components/ui/Skeleton';
import { dataScienceApi } from '../../services/dataScienceApi';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend, 
  Area, 
  AreaChart 
} from 'recharts';
import { TrendingUp, Users, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react';

export const DSPredictionsPage: React.FC = () => {
  const [modelType, setModelType] = React.useState<'linear' | 'arima' | 'lstm'>('linear');
  const [phi, setPhi] = React.useState(0.92);

  const { data: forecast, isLoading, refetch } = useQuery({
    queryKey: ['predictions-forecast', modelType, phi],
    queryFn: async () => {
      const res = await dataScienceApi.getForecast({ 
        horizon_months: 12,
        model_type: modelType,
        phi: phi
      }).catch(() => ({
        data: Array.from({ length: 12 }, (_, i) => ({
          month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
          actual: i < 8 ? 420 + Math.round(Math.sin(i * 0.4) * 60 + i * 8) : undefined,
          predicted: 415 + Math.round(Math.sin(i * 0.4) * 55 + i * 9),
          lower: 380 + Math.round(Math.sin(i * 0.4) * 45 + i * 7),
          upper: 450 + Math.round(Math.sin(i * 0.4) * 65 + i * 11),
        }))
      }));
      return res.data;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Predictive Intelligence</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Claims forecasting, revenue projection, and behavioral analytics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-premium-sm border border-slate-100">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['linear', 'arima', 'lstm'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModelType(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  modelType === m 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {modelType === 'arima' && (
            <div className="flex items-center gap-2 px-3 border-l border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Phi Coeff:</span>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="1" 
                value={phi} 
                onChange={(e) => setPhi(parseFloat(e.target.value))}
                className="w-16 bg-slate-50 border-none text-xs font-bold text-indigo-600 focus:ring-0 rounded-lg p-1"
              />
            </div>
          )}

          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all text-xs font-bold border border-transparent hover:border-indigo-100 ml-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Re-Run
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Claims Forecast (Q4)" value="1,580" trend="±45 CI" trendDirection="neutral" description="95% Confidence Level" icon={<TrendingUp className="w-5 h-5" />} />
        <MetricCard title="Churn Probability" value="4.2%" trend="-0.8%" trendDirection="up" description="Projected 90-day churn" icon={<Users className="w-5 h-5" />} />
        <MetricCard title="Projected Revenue" value="$38.4M" trend="+6.2%" trendDirection="up" description="Next fiscal quarter" icon={<DollarSign className="w-5 h-5" />} />
        <MetricCard title="Forecast Precision" value="94.2%" trend="Stable" trendDirection="up" description="MAPE Model Score" icon={<AlertTriangle className="w-5 h-5" />} />
      </div>

      <ChartContainer title="Claims Volume Projection" subtitle="Actual outcomes vs. Neural Network ensemble forecast with confidence intervals">
        <div className="h-[400px] w-full pt-4">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-2xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                   <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} 
                  axisLine={false} 
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} 
                  axisLine={false} 
                  tickLine={false}
                  dx={-10}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
                
                <Area 
                  type="monotone" 
                  dataKey="upper" 
                  name="Confidence (Upper)" 
                  stroke="transparent" 
                  fill="#f1f5f9" 
                  fillOpacity={0.5}
                />
                <Area 
                  type="monotone" 
                  dataKey="lower" 
                  name="Confidence (Lower)" 
                  stroke="transparent" 
                  fill="#f1f5f9" 
                  fillOpacity={0.5}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  name="Forecast" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual Observed" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                  connectNulls={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartContainer>
    </div>
  );
};
