import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Save, Sliders, Database, Server, FlaskConical, Lock, Cpu, Workflow, GitBranch } from 'lucide-react';

export const ModelConfigPage: React.FC = () => {
  const { user } = useAuthStore();
  const isDataScientist = user?.roles.includes('data_scientist') || user?.roles.includes('admin');

  const [model, setModel] = useState('gpt-4-actuary');
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.95);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-large');

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Model Configuration & MLOps</h2>
          <p className="text-sm text-slate-500">
            {isDataScientist
              ? 'Full access to inference parameters, embedding models, and experiment tracking.'
              : 'View current model configuration. Advanced controls are restricted to Data Scientists.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-800">Inference Parameters</h3>
          </div>
          {isDataScientist ? (
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          ) : (
            <span className="text-xs font-semibold px-3 py-1.5 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Data Scientist Access Required
            </span>
          )}
        </div>
        
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Model Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-400" />
                Base Foundation Model
              </label>
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                disabled={!isDataScientist}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="gpt-4-actuary">MFC-Alytix Core (GPT-4 Finetune)</option>
                <option value="claude-3-opus">Claude 3 Opus (Financial Knowledge)</option>
                <option value="llama-3-local">Llama 3 70B (On-Premise Secure)</option>
                <option value="mixtral-8x7b">Mixtral 8x7B (Cost-Optimized)</option>
              </select>
              <p className="text-xs text-slate-500">Select the underlying model for actuarial reasoning.</p>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 flex justify-between">
                <span>Creativity (Temperature)</span>
                <span className="text-indigo-600 font-mono">{temperature}</span>
              </label>
              <input 
                type="range" min="0" max="1" step="0.1" value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                disabled={!isDataScientist}
                className="w-full accent-indigo-600 disabled:opacity-60"
              />
              <p className="text-xs text-slate-500">Lower = strict math; Higher = creative variability.</p>
            </div>

            {/* Top-P */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 flex justify-between">
                <span>Nucleus Sampling (Top-P)</span>
                <span className="text-indigo-600 font-mono">{topP}</span>
              </label>
              <input 
                type="range" min="0.1" max="1" step="0.05" value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                disabled={!isDataScientist}
                className="w-full accent-indigo-600 disabled:opacity-60"
              />
              <p className="text-xs text-slate-500">Controls diversity of token selection during generation.</p>
            </div>

            {/* Max Tokens */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 flex justify-between">
                <span>Max Output Tokens</span>
                <span className="text-indigo-600 font-mono">{maxTokens}</span>
              </label>
              <input 
                type="range" min="512" max="8192" step="512" value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                disabled={!isDataScientist}
                className="w-full accent-indigo-600 disabled:opacity-60"
              />
              <p className="text-xs text-slate-500">Maximum response length per inference call.</p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Embedding Model — DS Only */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <h4 className="text-md font-semibold text-slate-800">Embedding & Vector Configuration</h4>
              {!isDataScientist && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 uppercase">DS Only</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Embedding Model</label>
                <select 
                  value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)}
                  disabled={!isDataScientist}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="text-embedding-3-large">OpenAI text-embedding-3-large (3072d)</option>
                  <option value="text-embedding-3-small">OpenAI text-embedding-3-small (1536d)</option>
                  <option value="bge-large-en-v1.5">BGE-Large-EN v1.5 (On-Prem)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Vector Store</label>
                <select disabled={!isDataScientist} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                  <option>Pinecone (Cloud)</option>
                  <option>ChromaDB (On-Premise)</option>
                  <option>Weaviate (Hybrid)</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* RAG Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-indigo-600" />
              <h4 className="text-md font-semibold text-slate-800">RAG Knowledge Sources</h4>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer hover:bg-indigo-50 transition-colors">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Internal Company Memos & Mortality Experiences (2018-2024)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer hover:bg-indigo-50 transition-colors">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Public IFRS 17 & Solvency II Regulatory Guidelines</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50 cursor-pointer hover:bg-indigo-50 transition-colors">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                <span className="text-sm font-medium text-slate-700">Historical Competitor Pricing Data (External feed)</span>
              </label>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Experiment Tracking — DS Only */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5 text-indigo-600" />
              <h4 className="text-md font-semibold text-slate-800">Experiment Tracking</h4>
              {!isDataScientist && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700 uppercase">DS Only</span>}
            </div>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-2.5 font-semibold text-slate-700">Run ID</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-700">Model</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-700 text-right">Accuracy</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-700 text-right">Latency (ms)</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-700 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'EXP-042', model: 'GPT-4 Finetune v3', accuracy: '94.2%', latency: '820', status: 'Production' },
                    { id: 'EXP-041', model: 'Mixtral 8x7B', accuracy: '91.8%', latency: '340', status: 'Staging' },
                    { id: 'EXP-039', model: 'Llama 3 70B', accuracy: '89.1%', latency: '1200', status: 'Archived' },
                  ].map(exp => (
                    <tr key={exp.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-mono font-medium text-slate-900">{exp.id}</td>
                      <td className="px-5 py-3">{exp.model}</td>
                      <td className="px-5 py-3 text-right font-mono">{exp.accuracy}</td>
                      <td className="px-5 py-3 text-right font-mono">{exp.latency}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                          exp.status === 'Production' ? 'bg-emerald-100 text-emerald-700' :
                          exp.status === 'Staging' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isDataScientist && (
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" /> Start New Experiment
                </button>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-sm font-semibold rounded-lg transition flex items-center gap-2">
                  <GitBranch className="w-4 h-4" /> Compare Runs
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
