import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Server, Building, Laptop, PieChart as PieChartIcon, ArrowDownCircle, PlusSquare, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { financialApi } from '../../services/financialApi';

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6'];

export const InventoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdminOrChief = user?.roles.includes('admin') || user?.roles.includes('chief_accountant');

  const { data: assets, isLoading: assetsLoading } = useQuery({
    queryKey: ['fixed-assets'],
    queryFn: financialApi.getAssets
  });

  const { data: valuation, isLoading: valuationLoading } = useQuery({
    queryKey: ['fixed-assets-valuation'],
    queryFn: financialApi.getAssetValuation
  });

  if (assetsLoading || valuationLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const assetClassData = assets ? Object.entries(
    assets.reduce((acc: any, asset: any) => {
      acc[asset.category] = (acc[asset.category] || 0) + Number(asset.current_book_value);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Fixed Assets & Inventory</h2>
          <p className="text-sm text-slate-500">Corporate asset ledger tracking CapEx, Right-of-Use leases, and depreciation schedules.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-2">
            <PlusSquare className="w-4 h-4" /> Capitalize Asset
          </button>
          <button 
            disabled={!isAdminOrChief}
            className={`${isAdminOrChief ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-2`}
          >
            <ArrowDownCircle className="w-4 h-4" /> Run Monthly Depreciation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Net Book Value"
          value={`$${(valuation?.total_book_value || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          trend={`${assets?.length || 0} Active Assets`}
          trendDirection="neutral"
          icon={<Building className="w-5 h-5" />}
        />
        <MetricCard
          title="Accumulated Depreciation"
          value={`$${(valuation?.total_depreciation || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          trend="Contra-Asset Balance"
          trendDirection="down"
          icon={<ArrowDownCircle className="w-5 h-5" />}
        />
        <MetricCard
          title="Total Asset Cost"
          value={`$${(valuation?.total_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`}
          trend="Historical Value"
          trendDirection="up"
          icon={<Server className="w-5 h-5" />}
        />
        <MetricCard
          title="Lease Obligations"
          value="$2.1M"
          trend="IFRS 16 Liabilities"
          trendDirection="down"
          icon={<Laptop className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-indigo-500"/> Asset Class Focus</h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={assetClassData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {assetClassData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Total NBV']} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Fixed Asset Register</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-700">ID</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Description</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Purchase Dt</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">Cost</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">NBV</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {assets?.map((asset: any) => {
                  const nbv = asset.current_book_value;
                  return (
                    <tr key={asset.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-mono font-medium text-slate-900">ASSET-{asset.id}</td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-700">{asset.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">{asset.category}</div>
                      </td>
                      <td className="px-5 py-3 text-xs">{new Date(asset.purchase_date).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-right font-mono text-slate-500">
                        ${asset.purchase_price.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                      </td>
                      <td className={`px-5 py-3 text-right font-mono font-semibold ${nbv === 0 ? 'text-slate-400' : 'text-slate-900'}`}>
                        ${Number(nbv).toLocaleString(undefined, { minimumFractionDigits: 0 })}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          asset.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                          asset.status === 'Fully Depreciated' ? 'bg-slate-200 text-slate-500' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
