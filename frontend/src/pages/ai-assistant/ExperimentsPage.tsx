import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { FlaskConical, Play, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const experiments = [
  { id: 'EXP-042', name: 'GPT-4o Finetune v3 (Actuarial QA)', model: 'gpt-4o-ft-0125', status: 'Running', accuracy: '87.2%', cost: '$12.40', started: '3 hours ago' },
  { id: 'EXP-041', name: 'Claude Sonnet vs GPT-4o (Claims Summary)', model: 'A/B comparison', status: 'Completed', accuracy: '91.5% vs 88.3%', cost: '$8.20', started: '1 day ago' },
  { id: 'EXP-040', name: 'Embed Model Swap: ada-002 → text-3-large', model: 'text-embedding-3-large', status: 'Completed', accuracy: '+4.1% retrieval', cost: '$2.80', started: '3 days ago' },
  { id: 'EXP-039', name: 'RAG Chunk Size Optimization (512 vs 1024)', model: 'gpt-4o', status: 'Completed', accuracy: '1024 → +2.8%', cost: '$5.50', started: '1 week ago' },
];

export const ExperimentsPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Experiment Tracking</h2>
        <p className="text-sm text-slate-500">A/B tests, finetune runs, and RAG configuration experiments. Data Scientist workspace.</p>
      </div>
      <button className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-violet-700 transition flex items-center gap-2">
        <Play className="w-4 h-4" /> New Experiment
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Total Experiments" value={experiments.length.toString()} trend="All time" trendDirection="neutral" icon={<FlaskConical className="w-5 h-5" />} />
      <MetricCard title="Active" value="1" trend="Running now" trendDirection="up" icon={<Clock className="w-5 h-5" />} />
      <MetricCard title="Best Accuracy" value="91.5%" trend="EXP-041" trendDirection="up" icon={<TrendingUp className="w-5 h-5" />} />
      <MetricCard title="Total Spend" value="$28.90" trend="This month" trendDirection="neutral" icon={<CheckCircle className="w-5 h-5" />} />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 font-semibold text-slate-700">ID</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Experiment</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Model</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Result</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Cost</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {experiments.map(e => (
            <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-3 font-mono font-medium text-slate-900">{e.id}</td>
              <td className="px-5 py-3 font-medium text-slate-700">{e.name}</td>
              <td className="px-5 py-3 text-xs font-mono text-slate-500">{e.model}</td>
              <td className="px-5 py-3 text-center text-xs font-semibold text-indigo-700">{e.accuracy}</td>
              <td className="px-5 py-3 text-center text-xs font-mono">{e.cost}</td>
              <td className="px-5 py-3 text-center">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${e.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{e.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
