import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { Skeleton } from '../../components/ui/Skeleton';
import { dataScienceApi } from '../../services/dataScienceApi';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ShieldAlert, Target, Users, TrendingUp, RefreshCw, ChevronRight } from 'lucide-react';

export const DSRiskPage: React.FC = () => {
  const { data: riskSegments, isLoading, refetch } = useQuery({
    queryKey: ['risk-segments'],
    queryFn: async () => {
      const res = await dataScienceApi.getRiskSegments().catch(() => ({
        data: [
          { segment: 'Very Low', customers: 245000, avgPremium: 820, claimRate: 2.1 },
          { segment: 'Low', customers: 412000, avgPremium: 1150, claimRate: 4.8 },
          { segment: 'Medium', customers: 189000, avgPremium: 1680, claimRate: 8.2 },
          { segment: 'High', customers: 38000, avgPremium: 2950, claimRate: 15.6 },
          { segment: 'Very High', customers: 8200, avgPremium: 4800, claimRate: 28.3 },
        ]
      }));
      return res.data;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Risk Intelligence</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Customer scoring, claim probability models, and underwriting support.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-premium border border-slate-100 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Recalculate Scores
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Model" value="XGBoost v4.2" trend="AUC: 0.89" trendDirection="up" description="Production ensemble" icon={<ShieldAlert className="w-5 h-5" />} />
        <MetricCard title="Customers Scored" value="892K" trend="Real-time" trendDirection="up" description="Batch processing active" icon={<Users className="w-5 h-5" />} />
        <MetricCard title="Risk Precision" value="87.3%" trend="+1.2%" trendDirection="up" description="Model accuracy metrics" icon={<Target className="w-5 h-5" />} />
        <MetricCard title="Conversion Lift" value="3.8x" trend="Optimized" trendDirection="up" description="vs control group" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <ChartContainer title="Risk Segmentation Profile" subtitle="Distribution of customer segments by claim probability">
            <div className="h-[350px] w-full pt-4">
              {isLoading ? (
                <Skeleton className="h-full w-full rounded-2xl" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskSegments} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="segment" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} dx={-10} tickFormatter={v => `${v}%`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                      formatter={(value: any) => [`${value}%`, 'Claim Rate']}
                    />
                    <Bar dataKey="claimRate" name="Claim Rate %" fill="#818cf8" radius={[8, 8, 0, 0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </ChartContainer>
        </div>

        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-base font-bold text-slate-800">Segment Intelligence</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <div key={i} className="p-4"><Skeleton key={i} className="h-10 w-full" /></div>)
            ) : (
              riskSegments?.map((s: any) => (
                <div key={s.segment} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div>
                    <p className="font-bold text-sm text-slate-800">{s.segment}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{s.customers.toLocaleString()} Policyholders</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-sm font-bold text-slate-900">{s.claimRate}%</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Prob.</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 bg-slate-50/30">
            <button className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all">
              Export Segment Profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
