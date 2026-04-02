import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  ChevronRight, 
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Calculator
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  Cell,
  ComposedChart,
  Area
} from 'recharts';

const AE_DATA = [
  { age: '20-29', actual: 45, expected: 48, ratio: 93.7 },
  { age: '30-39', actual: 112, expected: 105, ratio: 106.7 },
  { age: '40-49', actual: 285, expected: 290, ratio: 98.3 },
  { age: '50-59', actual: 642, expected: 610, ratio: 105.2 },
  { age: '60-69', actual: 1240, expected: 1180, ratio: 105.1 },
  { age: '70-79', actual: 2150, expected: 2250, ratio: 95.6 },
  { age: '80+', actual: 3800, expected: 3750, ratio: 101.3 },
];

const RECENT_STUDIES = [
  { id: 'EXP-401', name: 'Q1 2025 Mortality Investigation', category: 'Mortality', status: 'Completed', variance: '+1.2%', impact: '$1.4M', color: 'indigo' },
  { id: 'EXP-402', name: 'Group Life Disability Study', category: 'Morbidity', status: 'In Progress', variance: '-2.4%', impact: '$0.8M', color: 'emerald' },
  { id: 'EXP-403', name: 'Annuity Lapse Analysis', category: 'Persistency', status: 'Pending Review', variance: '+5.1%', impact: '$4.2M', color: 'rose' },
];

export const ExperienceInvestigationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mortality' | 'lapses' | 'expenses'>('mortality');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-600" />
            Experience Investigation <span className="text-slate-300 font-light">/</span> Actual vs Expected
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Deep-dive analysis of portfolio performance against valuation basis.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-3.5 h-3.5" /> Filter Basis
           </button>
           <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <Download className="w-3.5 h-3.5" /> Export Data Cube
           </button>
        </div>
      </div>

      {/* KPI Overlays */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Overall A/E Ratio', value: '101.4%', trend: '+0.2%', icon: Target, subtitle: 'Aggregate Mortality', color: 'indigo' },
           { label: 'Claims Variance', value: '$ 12.4M', trend: 'Adverse', icon: TrendingUp, subtitle: 'Vs Expected Basis', color: 'rose' },
           { label: 'Confidence Level', value: '98.5%', trend: 'High', icon: CheckCircle, subtitle: 'Statistical Credibility', color: 'emerald' },
           { label: 'Exposure at Risk', value: '$ 4.2B', trend: 'Stable', icon: Calculator, subtitle: 'Insurance in Force', color: 'slate' },
         ].map((kpi, i) => (
            <div key={i} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all relative overflow-hidden">
               <div className={`absolute top-0 right-0 w-32 h-32 bg-${kpi.color}-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000`} />
               <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`p-3 bg-${kpi.color}-50 rounded-2xl`}>
                     <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-${kpi.trend === 'Adverse' ? 'rose' : kpi.trend === 'High' ? 'emerald' : 'indigo'}-50 text-${kpi.trend === 'Adverse' ? 'rose' : kpi.trend === 'High' ? 'emerald' : 'indigo'}-600`}>
                    {kpi.trend}
                  </span>
               </div>
               <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 italic">{kpi.subtitle}</p>
               </div>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Investigation Plot */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-2xl p-10 space-y-8">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-black text-slate-900 tracking-tight">Experience vs Expectation Gradient</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Dimension: Age Band | Metric: Claims Volume</p>
              </div>
              <div className="flex gap-2">
                 {['Frequency', 'Severity', 'A/E Ratio'].map(t => (
                    <button key={t} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === 'A/E Ratio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}>{t}</button>
                 ))}
              </div>
           </div>

           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <ComposedChart data={AE_DATA} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#94a3b8'}} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#94a3b8'}} />
                    <YAxis yAxisId="right" orientation="right" domain={[80, 120]} axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: '#6366f1'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: '#fff' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Bar yAxisId="left" dataKey="expected" name="Expected (Valuation)" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={40} />
                    <Bar yAxisId="left" dataKey="actual" name="Actual (Experience)" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="ratio" name="A/E Ratio %" stroke="#f43f5e" strokeWidth={4} dot={{ r: 6, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '40px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.1em' }} />
                 </ComposedChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Sidebar: credibilty & Study Status */}
        <div className="space-y-8">
           {/* Credibility Score */}
           <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                 <Shield className="w-32 h-32 text-indigo-400" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300/60 mb-6">Statistical Credibility</p>
              <div className="flex items-end gap-3 mb-8">
                 <h4 className="text-5xl font-black italic tracking-tighter">0.94</h4>
                 <p className="text-xs font-bold text-indigo-300 mb-2 uppercase">Full Credibility Threshold: 1.0</p>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span>Sample Robustness</span>
                    <span className="text-indigo-400">92%</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[92%]" />
                 </div>
                 <p className="text-[10px] leading-relaxed text-indigo-200/60 italic">"The Q1 dataset has reached a credible volume for term life products. Adjustments to the Gompertz parameters are now statistically justified."</p>
              </div>
           </div>

           {/* Recent Studies Table */}
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl p-8">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Recent Investigations</h4>
              <div className="space-y-4">
                 {RECENT_STUDIES.map(study => (
                    <div key={study.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-lg transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[9px] font-mono text-slate-400">{study.id}</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                       </div>
                       <p className="text-[11px] font-bold text-slate-800 mb-1">{study.name}</p>
                       <div className="flex items-center gap-3">
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-${study.color}-50 text-${study.color}-600`}>{study.category}</span>
                          <span className="text-[9px] font-black text-slate-400">Impact: <span className="text-slate-700">{study.impact}</span></span>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-500 transition-all">Start New Investigation</button>
           </div>
        </div>

      </div>

      {/* Data Explorer Table (Professional High-Density) */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
               <h3 className="text-lg font-black text-slate-900 tracking-tight">Granular Policy-Level Variance</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Displaying top risks based on adverse variance</p>
            </div>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input placeholder="Search Policy ID..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 outline-none w-64" />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100">
                     <th className="px-8 py-4">Policy Segment</th>
                     <th className="px-8 py-4 text-right">Lives Exposed</th>
                     <th className="px-8 py-4 text-right">Actual Deaths</th>
                     <th className="px-8 py-4 text-right">Expected Deaths</th>
                     <th className="px-8 py-4 text-right text-indigo-600">A/E Ratio</th>
                     <th className="px-8 py-4 text-right">Basis Surplus/Deficit</th>
                     <th className="px-8 py-4 text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                    { segment: 'Retail Term Life', exposure: '142,400', actual: '2,402', expected: '2,350', ratio: '102.2%', variance: '-$1.4M', status: 'Review' },
                    { segment: 'Critical Illness', exposure: '84,200', actual: '810', expected: '940', ratio: '86.1%', variance: '+$2.8M', status: 'Optimal' },
                    { segment: 'Whole Life LP', exposure: '215,000', actual: '4,100', expected: '4,050', ratio: '101.2%', variance: '-$0.9M', status: 'Review' },
                    { segment: 'Group Credit', exposure: '412,800', actual: '1,120', expected: '1,200', ratio: '93.3%', variance: '+$1.2M', status: 'Optimal' },
                    { segment: 'Annuites in Payment', exposure: '12,400', actual: '412', expected: '380', ratio: '108.4%', variance: '-$3.1M', status: 'Action' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                       <td className="px-8 py-5">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-slate-800 tracking-tight">{row.segment}</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {204 + i}XE_GRP</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right text-xs font-black text-slate-600 font-mono">{row.exposure}</td>
                       <td className="px-8 py-5 text-right text-xs font-black text-slate-600 font-mono">{row.actual}</td>
                       <td className="px-8 py-5 text-right text-xs font-black text-slate-600 font-mono">{row.expected}</td>
                       <td className="px-8 py-5 text-right">
                          <span className={`text-xs font-black font-mono ${parseFloat(row.ratio) > 100 ? 'text-rose-600' : 'text-emerald-600'}`}>{row.ratio}</span>
                       </td>
                       <td className={`px-8 py-5 text-right text-xs font-bold font-mono ${row.variance.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{row.variance}</td>
                       <td className="px-8 py-5">
                          <div className="flex justify-center">
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                row.status === 'Optimal' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                row.status === 'Review' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                'bg-rose-50 text-rose-600 border border-rose-100'
                             }`}>
                                {row.status}
                             </span>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 5 of 142 Segments</span>
            <div className="flex gap-2">
               {[1,2,3].map(p => <button key={p} className={`w-8 h-8 rounded-lg text-[10px] font-black ${p === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-400'}`}>{p}</button>)}
            </div>
         </div>
      </div>

    </div>
  );
};

interface ShieldProps {
  className?: string;
}

const Shield: React.FC<ShieldProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
