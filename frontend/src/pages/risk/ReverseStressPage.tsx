import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { TrendingDown, AlertTriangle, Flame, Shield } from 'lucide-react';

const reverseScenarios = [
  { id: 'RS-001', scenario: 'Solvency Ratio Breach (<100%)', trigger: 'Interest rate drop of 350bps + simultaneous equity crash of 45%', probability: 'Very Low', impact: 'Catastrophic', status: 'Monitored' },
  { id: 'RS-002', scenario: 'Liquidity Crisis', trigger: 'Mass policy surrenders (>30% in 90 days) triggered by credit downgrade', probability: 'Low', impact: 'Severe', status: 'Monitored' },
  { id: 'RS-003', scenario: 'Operational Collapse', trigger: 'Simultaneous cyber attack + key-person loss in actuarial and IT', probability: 'Very Low', impact: 'Severe', status: 'Documented' },
  { id: 'RS-004', scenario: 'Reinsurer Default', trigger: 'Top 3 reinsurers fail concurrently (correlated exposure)', probability: 'Extremely Low', impact: 'Catastrophic', status: 'Monitored' },
];

export const ReverseStressPage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-slate-900">Reverse Stress Testing</h2>
      <p className="text-sm text-slate-500">Identify scenarios that would render the business non-viable. Required under ORSA and Solvency II frameworks.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Scenarios Identified" value="4" trend="Board reviewed" trendDirection="neutral" icon={<TrendingDown className="w-5 h-5" />} />
      <MetricCard title="Catastrophic Risks" value="2" trend="Solvency + Reinsurer" trendDirection="down" icon={<Flame className="w-5 h-5" />} />
      <MetricCard title="Last Review" value="Q3 2025" trend="Annual cycle" trendDirection="neutral" icon={<Shield className="w-5 h-5" />} />
      <MetricCard title="Mitigants Active" value="12" trend="Controls in place" trendDirection="up" icon={<AlertTriangle className="w-5 h-5" />} />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 font-semibold text-slate-700">ID</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Scenario</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Trigger Condition</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Probability</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Impact</th>
          </tr>
        </thead>
        <tbody>
          {reverseScenarios.map(s => (
            <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-3 font-mono font-medium text-slate-900">{s.id}</td>
              <td className="px-5 py-3 font-medium text-slate-700">{s.scenario}</td>
              <td className="px-5 py-3 text-sm max-w-[300px]">{s.trigger}</td>
              <td className="px-5 py-3 text-center"><span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">{s.probability}</span></td>
              <td className="px-5 py-3 text-center"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${s.impact === 'Catastrophic' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{s.impact}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
