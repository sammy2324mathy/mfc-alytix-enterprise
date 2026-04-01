import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { financialApi, Product, Warehouse } from '../../services/financialApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Package, Truck, Warehouse as WarehouseIcon, AlertTriangle, Search, Filter, Plus, ChevronRight, BarChart2 } from 'lucide-react';

export const InventoryControlPage: React.FC = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: financialApi.getProducts
  });

  const { data: stockLevels } = useQuery({
    queryKey: ['stock-levels'],
    queryFn: financialApi.getStockLevels
  });

  const { data: valuation, isLoading: isLoadingValuation } = useQuery({
    queryKey: ['inventory-valuation'],
    queryFn: financialApi.getInventoryValuation
  });

  const [searchTerm, setSearchTerm] = useState('');

  const lowStockCount = stockLevels?.filter(s => s.current_qty < 50).length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventory Control</h2>
          <p className="text-sm text-slate-500">Real-time stock ledger, multi-warehouse tracking, and automated valuation.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-premium hover:bg-indigo-700 transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Inventory Value" value={`$${(valuation || 0).toLocaleString()}`} trend="+4.2%" trendDirection="up" description="Current Asset Valuation" icon={<BarChart2 className="w-5 h-5" />} onClick={() => {}} />
        <MetricCard title="Total SKU Count" value={(products?.length || 0).toString()} trend="Active Catalog" trendDirection="neutral" description="Active Catalog Items" icon={<Package className="w-5 h-5" />} onClick={() => {}} />
        <MetricCard title="Low Stock Alerts" value={lowStockCount.toString()} trend="Action Required" trendDirection="down" description="Items below reorder point" icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} onClick={() => {}} />
        <MetricCard title="Global Warehouses" value="4" trend="Active Locations" trendDirection="neutral" description="Multi-node distribution" icon={<WarehouseIcon className="w-5 h-5" />} onClick={() => {}} />
      </div>

      <div className="bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by SKU, Name or Category..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">In Stock</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Out of Stock</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Product / SKU</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px]">Category</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px] text-right">Avg Cost</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px] text-right">Selling Price</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px] text-center">Global Qty</th>
                <th className="px-6 py-4 font-bold text-slate-800 uppercase tracking-wider text-[11px] text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(isLoadingProducts ? Array(5).fill({}) : (products || [])).map((product, idx) => (
                <tr key={product.id || idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <Package className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">{product.name || 'Sample Product Name'}</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5">{product.sku || 'SKU-00000'}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {product.category || 'Hardware'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-slate-600">
                    ${Number(product.current_cost || 120.50).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                    ${Number(product.sales_price || 299.99).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-bold text-slate-900">
                      {(stockLevels?.find(s => s.id === product.id)?.current_qty || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400">Total Units</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      (stockLevels?.find(s => s.id === product.id)?.current_qty || 0) > 100 ? 'bg-emerald-100 text-emerald-700' :
                      (stockLevels?.find(s => s.id === product.id)?.current_qty || 0) > 0 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                        {(stockLevels?.find(s => s.id === product.id)?.current_qty || 0) > 100 ? 'Healthy' :
                         (stockLevels?.find(s => s.id === product.id)?.current_qty || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                        <ChevronRight className="w-5 h-5" />
                    </button>
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
