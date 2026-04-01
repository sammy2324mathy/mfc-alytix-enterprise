import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialApi, BankAccount } from '../../services/financialApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { Wallet, TrendingUp, RefreshCcw, Download, ArrowRightLeft, CheckCircle2, AlertCircle, ChevronRight, PieChart, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const cashFlowData = [
  { day: 'Mon', in: 120000, out: 85000 },
  { day: 'Tue', in: 145000, out: 92000 },
  { day: 'Wed', in: 95000, out: 115000 },
  { day: 'Thu', in: 210000, out: 75000 },
  { day: 'Fri', in: 180000, out: 240000 },
  { day: 'Sat', in: 45000, out: 12000 },
  { day: 'Sun', in: 30000, out: 8000 },
];

export const CashBankPage: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [reconcileMode, setReconcileMode] = useState<string | null>(null);

  const { data: bankAccounts, isLoading } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: () => financialApi.getBankAccounts()
  });

  const reconcileMutation = useMutation({
    mutationFn: financialApi.reconcileTransaction,
    onSuccess: () => {
        showToast('Transaction reconciled in GL', 'success');
        setReconcileMode(null);
    }
  });

  const totalLiquidity = bankAccounts?.reduce((acc, a) => acc + a.balance, 0) || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Treasury & Bank</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Monitor global liquidity, cash flows, and daily reconciliation.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white rounded-2xl shadow-premium border border-slate-100 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Import MT940
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-2xl shadow-premium text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
             <ArrowRightLeft className="w-4 h-4" /> Inter-Account Transfer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Group Liquidity" value={`$${(totalLiquidity/1000000).toFixed(1)}M`} trend="+1.2M vs LW" trendDirection="up" icon={<Wallet className="w-5 h-5 text-emerald-500" />} />
        <MetricCard title="Net Daily Flow" value="+$42,500" trend="Positive" trendDirection="up" icon={<Activity className="w-5 h-5 text-sky-500" />} />
        <MetricCard title="Unreconciled Items" value="12" trend="Action Required" trendDirection="down" icon={<RefreshCcw className="w-5 h-5 text-amber-500" />} />
        <MetricCard title="FX Exposure (EUR)" value="€1.25M" trend="Stable" trendDirection="neutral" icon={<PieChart className="w-5 h-5 text-indigo-500" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Analytics Section */}
        <div className="xl:col-span-2 space-y-8">
           <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold text-slate-900">7-Day Liquidity Trend</h3>
                 <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <div className="w-2 h-2 rounded-full bg-emerald-500" /> Inflow
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <div className="w-2 h-2 rounded-full bg-rose-500" /> Outflow
                    </span>
                 </div>
              </div>
              <div className="h-[350px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                       <defs>
                          <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} tickFormatter={(v) => `$${v/1000}k`} />
                       <RechartsTooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                         cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                       />
                       <Area type="monotone" dataKey="in" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                       <Area type="monotone" dataKey="out" stroke="#f43f5e" strokeWidth={3} fill="transparent" strokeDasharray="6 6" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-lg font-bold text-slate-800">Global Bank Accounts</h3>
                 <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">Manage Connections <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                 {isLoading ? (
                    Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
                 ) : (
                    bankAccounts?.map((acc) => (
                       <div key={acc.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:shadow-premium transition-all group">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{acc.bank_name}</p>
                          <h4 className="text-sm font-bold text-slate-800 mb-4">{acc.account_name}</h4>
                          <p className="text-2xl font-display font-bold text-slate-900 mb-1">${(acc.balance/1000000).toFixed(2)}M</p>
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-mono text-slate-400 font-bold">{acc.account_number}</span>
                             <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-lg uppercase">Synced</span>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* Reconciliation Panel */}
        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 flex flex-col min-h-[600px] overflow-hidden">
           <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">Reconciliation Workspace</h3>
              <RefreshCcw className="w-5 h-5 text-slate-400 cursor-pointer hover:text-sky-600 transition-colors" />
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {[
                  { id: 'T1', desc: 'Wire In: Munich Re Syndicate', amt: 280000.00, type: 'in', date: '21 Nov' },
                  { id: 'T2', desc: 'Direct Debit: AWS Ireland', amt: 14500.00, type: 'out', date: '21 Nov' },
                  { id: 'T3', desc: 'Broker Settlement: Apex Ltd', amt: 82400.00, type: 'out', date: '22 Nov' },
                  { id: 'T4', desc: 'Premium Receipt: Client 998', amt: 315000.00, type: 'in', date: '23 Nov' },
              ].map((tx) => (
                  <div key={tx.id} className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-sky-200 hover:shadow-md transition-all group">
                     <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.date}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${tx.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                           {tx.type === 'in' ? 'Deposit' : 'Withdrawal'}
                        </span>
                     </div>
                     <p className="text-sm font-bold text-slate-800 mb-1">{tx.desc}</p>
                     <p className={`text-lg font-mono font-bold ${tx.type === 'in' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.type === 'in' ? '+' : '-'}${tx.amt.toLocaleString()}
                     </p>
                     
                     <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold hover:bg-slate-100 transition-all uppercase tracking-wider">Find Match</button>
                        <button 
                          onClick={() => reconcileMutation.mutate({ statement_line_id: tx.id, gl_transaction_id: 123 })}
                          className="flex-1 px-3 py-2 bg-sky-50 text-sky-600 rounded-xl text-[10px] font-bold hover:bg-sky-100 transition-all uppercase tracking-wider"
                        >
                           Auto-Post
                        </button>
                     </div>
                  </div>
              ))}
           </div>
           <div className="p-6 bg-slate-50 border-t border-slate-100">
              <button className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-premium hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> Batch Reconcile All
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};
