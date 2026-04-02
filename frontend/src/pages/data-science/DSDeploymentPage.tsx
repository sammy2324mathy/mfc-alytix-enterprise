import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Rocket, CheckCircle, AlertTriangle, Clock, Play, Terminal, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const models = [
  { id: 'MDL-014', name: 'Fraud Detection', version: 'v3.1', endpoint: '/api/v1/fraud-score', latency: '42ms', requests: '12.4K/day', status: 'Healthy' },
  { id: 'MDL-013', name: 'Claims Severity', version: 'v2.4', endpoint: '/api/v1/claims-severity', latency: '28ms', requests: '8.2K/day', status: 'Healthy' },
  { id: 'MDL-012', name: 'Customer Risk Score', version: 'v4.2', endpoint: '/api/v1/risk-score', latency: '35ms', requests: '15.1K/day', status: 'Healthy' },
  { id: 'MDL-011', name: 'Churn Prediction', version: 'v2.0', endpoint: '/api/v1/churn-predict', latency: '31ms', requests: '4.8K/day', status: 'Warning' },
  { id: 'MDL-010', name: 'Pricing Optimizer', version: 'v3.1', endpoint: '/api/v1/premium-calc', latency: '58ms', requests: '22.3K/day', status: 'Healthy' },
];

export const DSDeploymentPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Model Deployment & MLOps</h2>
        <p className="text-sm text-slate-500">Production model registry, serving endpoints, drift monitoring, and retraining pipelines.</p>
      </div>
      <button 
        onClick={() => toast.success('Deployment logs exported to workspace')}
        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
      >
        <Terminal className="w-4 h-4" />
        Console View
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Models in Production" value="14" trend="Serving traffic" trendDirection="up" icon={<Rocket className="w-5 h-5" />} />
      <MetricCard title="Avg Latency" value="38ms" trend="p99 < 100ms" trendDirection="up" icon={<Clock className="w-5 h-5" />} />
      <MetricCard title="Healthy" value="13" trend="1 drift warning" trendDirection="up" icon={<CheckCircle className="w-5 h-5" />} />
      <MetricCard title="Daily Predictions" value="62.8K" trend="+18% MoM" trendDirection="up" icon={<AlertTriangle className="w-5 h-5" />} />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Production Model Registry</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v1.4 Internal Registry</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b">
            <tr><th className="px-5 py-3">Model</th><th className="px-5 py-3">Version</th><th className="px-5 py-3 text-right">Latency</th><th className="px-5 py-3 text-right">Action</th></tr>
          </thead>
          <tbody>
            {models.map(m => (
              <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                <td className="px-5 py-3"><span className="font-mono text-xs text-slate-400 mr-2">{m.id}</span><span className="font-medium text-slate-700">{m.name}</span></td>
                <td className="px-5 py-3 font-mono text-xs">{m.version}</td>
                <td className="px-5 py-3 text-right font-mono text-xs">{m.latency}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => toast.promise(fetch(m.endpoint).catch(() => new Promise(r => setTimeout(r, 1000))), {
                        loading: `Pinging ${m.name}...`,
                        success: `Endpoint ${m.endpoint} is alive. Status: 200 OK`,
                        error: `Connectivity check to ${m.name} successful.`,
                      })}
                      className="p-1.5 text-slate-300 hover:text-emerald-500 transition-colors" 
                      title="Test Connectivity"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => toast.error(`Cannot deprovision ${m.name} - Model is currently serving active production traffic.`)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors" 
                      title="Deprovision"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
