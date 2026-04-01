import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { financialApi } from '../../services/financialApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Settings, Play, CheckCircle, Clock, Plus, Filter, Database, Cpu, Layers } from 'lucide-react';

export const ManufacturingPage: React.FC = () => {
  const { data: boms, isLoading: isLoadingBoms } = useQuery({
    queryKey: ['boms'],
    queryFn: financialApi.getBoms
  });

  const { data: metrics } = useQuery({
    queryKey: ['manufacturing-metrics'],
    queryFn: financialApi.getManufacturingMetrics
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manufacturing & Production</h2>
          <p className="text-sm text-slate-500">Bill of Materials (BOM) management and Work Order orchestration.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-premium hover:bg-indigo-700 transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create BOM
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active BOMs" value={boms?.length.toString() || "8"} trend="Ready for Production" trendDirection="neutral" description="Validated Recipes" icon={<Layers className="w-5 h-5" />} />
        <MetricCard title="Work Orders" value={metrics?.active_wos.toString() || "14"} trend="In-flight" trendDirection="up" description="In-flight Production" icon={<Play className="w-5 h-5" />} />
        <MetricCard title="Production Uptime" value={`${metrics?.uptime || 98.4}%`} trend="+0.5%" trendDirection="up" description="Efficiency last 30d" icon={<Cpu className="w-5 h-5" />} />
        <MetricCard title="Completed Today" value={metrics?.completed_today.toString() || "5"} trend="Target: 8" trendDirection="neutral" description="Finished Goods Induction" icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" /> Bill of Materials Registry
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-white border-b border-slate-100">
                            <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Finished Good</th>
                            <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px] text-center">Components</th>
                            <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px] text-center">Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {(isLoadingBoms ? Array(3).fill({}) : (boms || [])).map((bom: any, idx) => (
                            <tr key={bom.id || idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">{bom.finished_good_name || 'Industrial Gearbox Unit'}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-[10px] font-bold">
                                        {bom.components_count || 12} Items
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        Active
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-indigo-600 transition p-2">
                                        <Settings className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-premium border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> Recent Production Runs
            </h3>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WO-2940{i}</span>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-bold">IN_PROGRESS</span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">Precision Engine Block v2</div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                            <span>Qty: 50 Units</span>
                            <span>WH: main-storage</span>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all">
                View All Work Orders
            </button>
        </div>
      </div>
    </div>
  );
};
