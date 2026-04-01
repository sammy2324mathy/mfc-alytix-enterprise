import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { BarChart } from '../../components/charts/BarChart';
import { Skeleton } from '../../components/ui/Skeleton';
import { riskApi } from '../../services/riskApi';
import { AlertTriangle, TrendingDown, Target, ShieldCheck, RefreshCw } from 'lucide-react';

export const StressTestsPage: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState('standard');

  const { data: stressResults, isLoading, refetch } = useQuery({
    queryKey: ['stress-tests', selectedProfile],
    queryFn: async () => {
      // In a real app, this would be a specific stress test endpoint
      // For now, we'll use the allocation or a mock that's fetched through the API
      return [
        { scenario: 'Base Case', availableCapital: 150.5, requiredCapital: 100.0 },
        { scenario: 'Equity Crash (-25%)', availableCapital: 120.2, requiredCapital: 105.0 },
        { scenario: 'Interest Rate +200bps', availableCapital: 140.8, requiredCapital: 110.0 },
        { scenario: 'Interest Rate -100bps', availableCapital: 145.2, requiredCapital: 115.0 },
        { scenario: '1-in-200 YR Pandemic', availableCapital: 90.5, requiredCapital: 125.0 },
        { scenario: 'Combined Severe Shock', availableCapital: 70.1, requiredCapital: 130.0 },
      ];
    }
  });

  const worstCase = stressResults?.find(s => s.scenario === 'Combined Severe Shock');
  const solvencyRatio = worstCase ? (worstCase.availableCapital / worstCase.requiredCapital * 100).toFixed(1) : '53.9';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Stress Testing</h2>
          <p className="text-slate-500 mt-1">Capital adequacy & solvency resilient modeling.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-premium border border-slate-100">
          <select 
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="border-none bg-transparent rounded-lg px-4 py-2 text-sm font-semibold focus:ring-0 cursor-pointer text-slate-700"
          >
            <option value="standard">Standard Regulatory Scenarios</option>
            <option value="internal">Internal Severe Models</option>
            <option value="historical">Historical Replays (2008, 2020)</option>
          </select>
          <button 
            onClick={() => refetch()}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Worst Case Solvency" value={`${solvencyRatio}%`} trend="-96.1%" trendDirection="down" description="(Combined Severe Shock)" icon={<AlertTriangle className="w-5 h-5 text-rose-500" />} />
        <MetricCard title="Capital Shortfall" value="$59.9M" trend="Critical" trendDirection="down" description="Post-shock deficit" icon={<TrendingDown className="w-5 h-5 text-rose-500" />} />
        <MetricCard title="Sensitivity" value="Interest Rates" trend="High" trendDirection="neutral" description="Primary risk driver" icon={<Target className="w-5 h-5" />} />
        <MetricCard title="Base Solvency" value="150.5%" trend="Stable" trendDirection="up" description="Regulatory requirement: 100%" icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />} />
      </div>

      <ChartContainer 
        title="Capital Adequacy Analysis" 
        subtitle="Available vs. Required Capital Post-Shock ($M)"
      >
        {isLoading ? (
          <Skeleton className="h-[450px] w-full rounded-xl" />
        ) : (
          <div className="h-[450px]">
            <BarChart 
              data={stressResults || []} 
              xKey="scenario" 
              yKey="availableCapital"
              colors={['#0ea5e9', '#0ea5e9', '#0ea5e9', '#0ea5e9', '#f43f5e', '#f43f5e']}
              height={450}
            />
          </div>
        )}
        <div className="absolute top-0 right-0 mt-[-40px] flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-sky-500" />
            <span>Pass Condition</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded bg-rose-500" />
            <span>Minimum Capital Breach</span>
          </div>
        </div>
      </ChartContainer>
    </div>
  );
};
