import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Server, Building, Laptop, ArrowDownCircle, PlusSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { financialApi } from '../../services/financialApi';

export const FixedAssetsPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdminOrChief = user?.roles.includes('admin') || user?.roles.includes('chief_accountant');

  const { data: assets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['fixed-assets'],
    queryFn: financialApi.getAssets
  });

  const { data: valuation, isLoading: isLoadingValuation } = useQuery({
    queryKey: ['asset-valuation'],
    queryFn: financialApi.getAssetValuation
  });

  const totalNBV = valuation?.total_book_value || 0;
  const totalDepr = valuation?.total_depreciation || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Fixed Asset Ledger</h2>
          <p className="text-sm text-slate-500">Corporate asset tracking CapEx, Right-of-Use leases, and depreciation schedules.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-2">
            <PlusSquare className="w-4 h-4" /> Capitalize Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Net Book Value" value={`$${totalNBV.toLocaleString()}`} trend="145 Active Assets" trendDirection="neutral" icon={<Building className="w-5 h-5" />} />
        <MetricCard title="Accumulated Depr." value={`$${totalDepr.toLocaleString()}`} trend="Contra-Asset" trendDirection="down" icon={<ArrowDownCircle className="w-5 h-5" />} />
        <MetricCard title="IT Infrastructure" value="$1.1M" trend="Servers & Hardware" trendDirection="up" icon={<Server className="w-5 h-5" />} />
        <MetricCard title="Lease Obligations" value="$2.1M" trend="IFRS 16" trendDirection="down" icon={<Laptop className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Fixed Asset Register</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-700">Asset Ref</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Description</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Purchase Dt</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">Orig Cost</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">NBV</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {(isLoadingAssets ? Array(4).fill({}) : (assets || [])).map((asset: any, idx: number) => {
                  const nbv = asset.current_book_value || 0;
                  return (
                    <tr key={asset.id || idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-mono font-medium text-slate-900">{asset.id ? `FAS-${asset.id.toString().padStart(5, '0')}` : 'FAS-XXXXX'}</td>
                      <td className="px-5 py-3 text-slate-700 font-medium">{asset.name || 'Industrial Asset Unit'}</td>
                      <td className="px-5 py-3 text-xs">{asset.purchase_date?.split('T')[0] || '2024-01-01'}</td>
                      <td className="px-5 py-3 text-right font-mono">${Number(asset.purchase_price || 0).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right font-mono font-semibold">${Number(nbv).toLocaleString()}</td>
                      <td className="px-5 py-3 text-center">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          asset.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                        }`}>{asset.status || 'ACTIVE'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};
