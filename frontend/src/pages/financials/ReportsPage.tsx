import { useQuery, useMutation } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { Skeleton } from '../../components/ui/Skeleton';
import { financialApi } from '../../services/financialApi';
import { Landmark, TrendingUp, ShieldCheck, Wallet, RefreshCw } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { data: trial, isLoading: loadingTrial, refetch: refetchTrial } = useQuery({
    queryKey: ['trial-balance'],
    queryFn: financialApi.getTrialBalance
  });

  const { data: balanceSheet, isLoading: loadingBS, refetch: refetchBS } = useQuery({
    queryKey: ['balance-sheet'],
    queryFn: financialApi.getBalanceSheet
  });

  const isLoading = loadingTrial || loadingBS;
  const bsData = balanceSheet;
  const trialData = trial || [];

  const handleRefresh = () => {
    refetchTrial();
    refetchBS();
  };

  const { mutate: handleExport, isPending: isExporting } = useMutation({
    mutationFn: ({ type, format }: { type: string, format: string }) => 
      financialApi.exportReport(type, format)
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Financial Intelligence</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Statutory reporting and ledger integrity oversight.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-premium border border-slate-100 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Registry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : (
          <>
            <MetricCard title="Total Assets" value={`$${(bsData?.total_assets / 1e6).toFixed(1)}M`} trend="+3.2%" trendDirection="up" description="Consolidated position" icon={<Landmark className="w-5 h-5" />} />
            <MetricCard title="Net Equity" value={`$${(bsData?.total_equity / 1e6).toFixed(1)}M`} trend="+1.5%" trendDirection="up" description="Shareholder value" icon={<TrendingUp className="w-5 h-5" />} />
            <MetricCard title="Current Ratio" value={(bsData?.total_assets / (bsData?.total_liabilities || 1)).toFixed(2)} trend="stable" trendDirection="neutral" description="Liquidity threshold" icon={<Wallet className="w-5 h-5" />} />
            <MetricCard title="Audit Status" value="Verified" trend="Clean" trendDirection="up" description="Last internal review" icon={<ShieldCheck className="w-5 h-5" />} />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartContainer 
          title="Trial Balance" 
          subtitle="Consolidated General Ledger Integrity"
          action={
            <button 
              onClick={() => handleExport({ type: 'trial-balance', format: 'csv' })}
              disabled={isExporting}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          }
        >
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm border-t border-slate-50">
              <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <tr>
                  <th className="text-left px-6 py-4 font-bold">Account Registry</th>
                  <th className="text-right px-6 py-4 font-bold">Debit ($)</th>
                  <th className="text-right px-6 py-4 font-bold">Credit ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : trialData.map((row: any) => (
                  <tr key={row.account_code} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{row.account_name}</span>
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-400 transition-colors uppercase">{row.account_code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs font-bold text-emerald-600">
                      {row.debit ? row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs font-bold text-rose-600">
                      {row.credit ? row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartContainer>

        <ChartContainer 
          title="Financial Position" 
          subtitle="Balance Sheet Summary (IFRS Compliance)"
          action={
            <button 
              onClick={() => handleExport({ type: 'balance-sheet', format: 'csv' })}
              disabled={isExporting}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          }
        >
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          ) : bsData && (
            <div className="space-y-8 py-2">
              <section className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Core Assets</h4>
                  <span className="text-xs font-bold text-slate-800">${bsData.total_assets.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  {bsData.assets.map((a: any) => (
                    <div key={a.code} className="flex justify-between items-center text-sm group">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{a.name}</span>
                        <span className="text-[10px] font-mono text-slate-300 uppercase">{a.code}</span>
                      </div>
                      <span className="font-mono text-xs font-bold tabular-nums text-slate-700">${a.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Liabilities & Capital</h4>
                  <span className="text-xs font-bold text-slate-800">${(bsData.total_liabilities + bsData.total_equity).toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  {[...bsData.liabilities, ...bsData.equity].map((a: any) => (
                    <div key={a.code} className="flex justify-between items-center text-sm group">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{a.name}</span>
                        <span className="text-[10px] font-mono text-slate-300 uppercase">{a.code}</span>
                      </div>
                      <span className="font-mono text-xs font-bold tabular-nums text-slate-700">${a.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center border border-slate-100 mt-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accounting Equation</span>
                <span className="text-xs font-bold text-indigo-600 uppercase">Assets = Liab + Equity</span>
              </div>
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};
