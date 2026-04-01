import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { AreaChart } from '../../components/charts/AreaChart';
import { PieChart } from '../../components/charts/PieChart';
import { LineChart } from '../../components/charts/LineChart';
import { Skeleton } from '../../components/ui/Skeleton';
import { actuarialApi } from '../../services/actuarialApi';
import { Activity, HeartPulse, Clock, TrendingDown, RefreshCw } from 'lucide-react';

const ageBandData = [
  { name: '< 30', value: 15 },
  { name: '30-45', value: 35 },
  { name: '46-60', value: 30 },
  { name: '> 60', value: 20 },
];

const improvementData = Array.from({ length: 20 }, (_, i) => ({
  year: 2024 + i,
  factor: parseFloat((1 - (i * 0.012)).toFixed(3))
}));

export const MortalityPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState('VBT2015');

  const { data: mortalityCurves, isLoading, refetch } = useQuery({
    queryKey: ['mortality-curves', selectedTable],
    queryFn: async () => {
      const maleRes = await actuarialApi.generateMortalityCurve({
        alpha: 0.0001,
        beta: 0.00005,
        c: 1.1,
        max_age: 100,
      });
      const femaleRes = await actuarialApi.generateMortalityCurve({
        alpha: 0.00008,
        beta: 0.00003,
        c: 1.09,
        max_age: 100,
      });

      const maleCurve = maleRes?.curve || [];
      const femaleCurve = femaleRes?.curve || [];
      const zipped = [];
      for (let i = 40; i <= 80 && i < maleCurve.length && i < femaleCurve.length; i++) {
        zipped.push({
          age: i,
          male: parseFloat(((maleCurve[i]?.qx || 0) * 1000).toFixed(2)),
          female: parseFloat(((femaleCurve[i]?.qx || 0) * 1000).toFixed(2)),
        });
      }
      return zipped;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Mortality Lab</h2>
          <p className="text-slate-500 mt-1">Experience study & actuarial curve modeling ecosystem.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-premium border border-slate-100">
          <select 
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="border-none bg-transparent rounded-lg px-4 py-2 text-sm font-semibold focus:ring-0 cursor-pointer text-slate-700"
          >
            <option value="VBT2015">2015 VBT Primary</option>
            <option value="CSO2001">2001 CSO</option>
            <option value="Custom">Experience 2023</option>
          </select>
          <button 
            onClick={() => refetch()}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="A/E Ratio" value="98.4%" trend="-1.2%" trendDirection="down" description="Current Portfolio Experience" icon={<Activity className="w-5 h-5" />} />
        <MetricCard title="Avg Duration" value="12.4 yrs" trend="+0.4" trendDirection="up" description="Inforce life portfolio" icon={<Clock className="w-5 h-5" />} />
        <MetricCard title="Base qx (65)" value="12.45" trend="stable" trendDirection="neutral" description="Rate per 1000" icon={<HeartPulse className="w-5 h-5" />} />
        <MetricCard title="Reserving Impact" value="$42.5M" trend="+5.1%" trendDirection="down" description="Expected Liability" icon={<TrendingDown className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartContainer 
          title="Static vs. Dynamic Mortality Curve" 
          subtitle="Gompertz-Makeham Model Comparison (1000 × qx)"
          className="lg:col-span-2"
        >
          {isLoading ? (
            <Skeleton className="h-[350px] w-full rounded-xl" />
          ) : (
            <LineChart 
              data={mortalityCurves || []} 
              xKey="age" 
              height={350}
              series={[
                { key: 'male', name: 'Standard Male', color: '#6366f1' },
                { key: 'female', name: 'Standard Female', color: '#ec4899' }
              ]} 
            />
          )}
        </ChartContainer>

        <div className="space-y-6">
          <ChartContainer title="Portfolio Exposure" subtitle="Distribution by Age Cohort">
            <PieChart data={ageBandData} height={200} innerRadius="70%" />
          </ChartContainer>

          <ChartContainer title="Improvement Trend" subtitle="Annual Projection Factors">
            <AreaChart data={improvementData} xKey="year" yKey="factor" color="#10b981" height={120} />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};
