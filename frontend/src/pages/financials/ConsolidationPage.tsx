import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Globe, TrendingUp, Building2, Calculator, ArrowUpRight, ArrowDownRight, Layers, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { financialApi } from '../../services/financialApi';

export const ConsolidationPage: React.FC = () => {
  const { data: consolidation, isLoading } = useQuery({
    queryKey: ['consolidation'],
    queryFn: () => financialApi.getConsolidatedPL(),
  });

  const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

  if (isLoading) return <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Consolidating Global Entities...</div>;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-premium border border-slate-100">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Consolidation</h1>
                <p className="text-sm text-slate-500 font-medium">Group-level financial performance & inter-company analytics.</p>
            </div>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border border-slate-200">
                <FileSpreadsheet className="w-4 h-4" /> Export for SAS/R
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-premium transition-all">
                <Calculator className="w-4 h-4" /> Run Elimination
            </button>
        </div>
      </div>

      {/* Group KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
              { label: 'Group Revenue', value: consolidation?.group_total_income, icon: TrendingUp, color: 'indigo' },
              { label: 'Group Operating Expense', value: consolidation?.group_total_expense, icon: ArrowDownRight, color: 'rose' },
              { label: 'Consolidated Net Profit', value: consolidation?.group_net_profit, icon: ArrowUpRight, color: 'emerald' },
          ].map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl shadow-premium border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                      <h3 className="text-2xl font-black text-slate-900">${(kpi.value || 0).toLocaleString()}</h3>
                  </div>
                  <div className={`w-12 h-12 bg-${kpi.color}-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Entity Breakdown Chart */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl shadow-premium border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-600" /> Revenue Contribution by Entity</h3>
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">FY 2024 Actuals</div>
              </div>
              <div className="flex-1 h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={consolidation?.entity_breakdown || []}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="company_name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} tickFormatter={(v) => `$${v/1000}k`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                         />
                          <Bar dataKey="income" radius={[10, 10, 0, 0]} barSize={40}>
                              {consolidation?.entity_breakdown?.map((_: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Group Composition */}
          <div className="lg:col-span-4 bg-white p-8 rounded-3xl shadow-premium border border-slate-100 flex flex-col">
              <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-600" /> Profit Distribution</h3>
              <div className="flex-1 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                              data={consolidation?.entity_breakdown || []}
                              dataKey="net_profit"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                          >
                              {consolidation?.entity_breakdown?.map((_: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
              <div className="mt-6 space-y-3">
                  {consolidation?.entity_breakdown?.map((entity: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                              <span className="font-bold text-slate-600">{entity.company_name}</span>
                          </div>
                          <span className="font-mono text-slate-400">${entity.net_profit.toLocaleString()}</span>
                      </div>
                  ))}
              </div>
          </div>

      </div>

    </div>
  );
};
