import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import {
  Lock, FileSignature, Landmark, TrendingUp, Loader2, Plus, Download, X,
  BarChart, Wallet, ArrowUpRight, ArrowDownRight, Search, MoreHorizontal, Filter, FileText, Upload
} from 'lucide-react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { financialApi } from '../../services/financialApi';

type AccountRow = {
  id: number;
  code: string;
  name: string;
  account_type: string;
  opening_balance: number;
  balance: number;
};

function formatAccountType(t: string) {
  const map: Record<string, string> = {
    asset: 'Asset',
    liability: 'Liability',
    equity: 'Equity',
    revenue: 'Revenue',
    expense: 'Expense',
  };
  return map[t] || t;
}

export const LedgerPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdminOrChief = user?.roles.includes('admin') || user?.roles.includes('chief_accountant');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: accountsRaw, isLoading: loading, error, refetch } = useQuery({
    queryKey: ['ledger-accounts'],
    queryFn: financialApi.getAccounts
  });

  const accounts = Array.isArray(accountsRaw) ? accountsRaw : [];

  const { mutate: exportTB, isPending: isExporting } = useMutation({
    mutationFn: (type: string) => financialApi.exportReport(type, 'csv')
  });

  const { mutate: uploadMutation, isPending: isUploading } = useMutation({
    mutationFn: financialApi.uploadAccounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger-accounts'] }); // Changed from 'accounts' to 'ledger-accounts' to match queryKey
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation(file);
  };

  const { mutate: createAccount, isPending: isCreating } = useMutation({
    mutationFn: (data: any) => financialApi.createAccount(data),
    onSuccess: () => {
      setIsModalOpen(false);
      refetch();
    }
  });

  const totals = useMemo(() => {
    const assets = accounts.filter((a) => a.account_type === 'asset').reduce((s, a) => s + a.balance, 0);
    const liabilities = accounts
      .filter((a) => a.account_type === 'liability')
      .reduce((s, a) => s + a.balance, 0);
    return { assets, liabilities };
  }, [accounts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">General Ledger</h2>
          <p className="text-sm text-slate-500">Real-time trial balance and ledger monitoring (data from accounting-service).</p>
        </div>
        <div className="flex gap-3">
            <div className="flex gap-2">
               <label className="cursor-pointer bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold shadow-premium transition flex items-center gap-2">
                  <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={isUploading} />
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Import Ledger
               </label>
               <button
                 onClick={() => exportTB('trial-balance')}
                 disabled={isExporting}
                 className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold shadow-premium transition flex items-center gap-2"
               >
                  <Download className="w-3.5 h-3.5" />
                  Export Trial Balance
               </button>
            </div>
          {isAdminOrChief && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
          )}
          {isAdminOrChief ? (
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center gap-2">
              <FileSignature className="w-4 h-4" />
              Post Manual Journal
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-slate-300 text-slate-500 text-sm font-medium rounded-lg shadow-sm cursor-not-allowed flex items-center gap-2"
              title="Only Chief Accountants or Admins can post manual journals."
            >
              <Lock className="w-4 h-4" />
              Post Manual Journal
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Assets"
          value={`$${totals.assets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="+5.2%"
          trendDirection="up"
          description="From chart of accounts"
          icon={<Landmark className="w-5 h-5" />}
        />
        <MetricCard
          title="Total Liabilities"
          value={`$${totals.liabilities.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="-2.1%"
          trendDirection="down"
          description="From chart of accounts"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-800">Chart of Accounts</h3>
          {!isAdminOrChief && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Read Only Mode
            </span>
          )}
        </div>
        {loading && (
          <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            Loading accounts…
          </div>
        )}
        {error && !loading && (
          <div className="p-6 text-sm text-rose-700 bg-rose-50 border-t border-rose-100">
            {error instanceof Error ? error.message : String(error)}. Ensure the API gateway is running on port 8000 and accounting-service on 8002 (or use Docker Compose).
          </div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-semibold text-slate-700">Account ID</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Account Name</th>
                  <th className="px-6 py-3 font-semibold text-slate-700">Type</th>
                  <th className="px-6 py-3 font-semibold text-slate-700 text-right">Balance (USD)</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">{account.code}</td>
                    <td className="px-6 py-4">{account.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          account.account_type === 'asset'
                            ? 'bg-sky-100 text-sky-700'
                            : account.account_type === 'liability'
                              ? 'bg-rose-100 text-rose-700'
                              : account.account_type === 'equity'
                                ? 'bg-purple-100 text-purple-700'
                                : account.account_type === 'revenue'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {formatAccountType(account.account_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                      $
                      {account.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-premium w-full max-w-md p-8 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">New Ledger Account</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              createAccount({
                name: formData.get('name'),
                code: formData.get('code'),
                account_type: formData.get('type'),
                opening_balance: Number(formData.get('balance'))
              });
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Name</label>
                <input name="name" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm" placeholder="e.g. Petty Cash" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Code</label>
                <input name="code" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-mono" placeholder="1001" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Type</label>
                <select name="type" required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm appearance-none bg-white">
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                  <option value="equity">Equity</option>
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opening Balance ($)</label>
                <input name="balance" type="number" step="0.01" defaultValue="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-mono" />
              </div>
              <button disabled={isCreating} type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-premium transition-all flex items-center justify-center gap-2">
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {isCreating ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
