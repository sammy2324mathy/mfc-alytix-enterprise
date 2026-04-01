import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialApi, PurchaseOrder, Supplier } from '../../services/financialApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ShoppingCart, FileText, ClipboardCheck, Clock, Plus, Search, MoreHorizontal, CheckCircle, Package } from 'lucide-react';

export const ProcurementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: pos, isLoading } = useQuery({
    queryKey: ['pos'],
    queryFn: financialApi.getPurchaseOrders
  });

  const { data: metrics } = useQuery({
    queryKey: ['procurement-metrics'],
    queryFn: financialApi.getProcurementMetrics
  });

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: financialApi.getSuppliers
  });

  const receiveMutation = useMutation({
    mutationFn: (id: number) => financialApi.receiveGoods(id, { warehouse_id: 1, items: [] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos'] });
      queryClient.invalidateQueries({ queryKey: ['stock-levels'] });
    }
  });

  const [activeView, setActiveView] = useState<'pos' | 'grns'>('pos');

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Procurement & Sourcing</h2>
          <p className="text-sm text-slate-500">Manage purchase lifecycles, supplier fulfillment, and goods receipt notes (GRN).</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex">
            <button 
              onClick={() => setActiveView('pos')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeView === 'pos' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Purchase Orders
            </button>
            <button 
              onClick={() => setActiveView('grns')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${activeView === 'grns' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Goods Receipt (GRN)
            </button>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-premium hover:bg-indigo-700 transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> New PO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Open Purchase Orders" value={metrics?.open_pos.toString() || "24"} trend="Ready for Receipt" trendDirection="neutral" icon={<FileText className="w-5 h-5" />} />
        <MetricCard title="Total Committed" value={`$${(metrics?.total_committed || 1240000).toLocaleString()}`} trend="+15% MoM" trendDirection="up" icon={<ShoppingCart className="w-5 h-5" />} />
        <MetricCard title="Receipt Compliance" value={`${metrics?.receipt_compliance || 98.2}%`} trend="On-time Delivery" trendDirection="up" icon={<ClipboardCheck className="w-5 h-5" />} />
        <MetricCard title="Avg. Lead Time" value={`${metrics?.avg_lead_time || 4.2} Days`} trend="-0.5 Days" trendDirection="down" icon={<Clock className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Recent Purchase Orders</h3>
            <div className="flex gap-2">
                {['All', 'Draft', 'Open', 'Received'].map(status => (
                    <button key={status} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-100 transition">
                        {status}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-[10px]">PO Reference</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-[10px]">Supplier</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-[10px]">Expected Date</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-[10px] text-right">Total Amount</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase text-[10px] text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(isLoading ? Array(5).fill({}) : (pos || [])).map((po: any, idx) => (
                <tr key={po.id || idx} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {po.order_number || 'PO-2024-001'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">
                      {suppliers?.find(s => s.id === po.supplier_id)?.name || 'Processing Supplier...'}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">Category: {suppliers?.find(s => s.id === po.supplier_id)?.code || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                    {po.expected_date ? new Date(po.expected_date).toLocaleDateString() : 'Mar 28, 2024'}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 text-lg">
                    ${(po.total_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        po.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-700' : 
                        po.status === 'OPEN' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {po.status || 'OPEN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {po.status === 'OPEN' && (
                          <button 
                            onClick={() => receiveMutation.mutate(po.id)}
                            disabled={receiveMutation.isPending}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" 
                            title="Receive Goods"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                            <MoreHorizontal className="w-4 h-4" />
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
};
