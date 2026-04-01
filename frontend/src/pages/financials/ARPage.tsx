import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialApi, Customer } from '../../services/financialApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { Users, AlertTriangle, CheckCircle, FileText, CheckSquare, XSquare, Plus, Search, Filter, RefreshCw } from 'lucide-react';

export const ARPage: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{id: number, name: string} | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ['ar-customers'],
    queryFn: () => financialApi.getCustomers()
  });

  const receiptMutation = useMutation({
    mutationFn: financialApi.postCustomerReceipt,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ar-customers'] });
        showToast('Payment receipt recorded successfully', 'success');
        setPaymentModal(null);
    },
    onError: () => showToast('Failed to record receipt', 'error')
  });

  const totalOutstanding = customers?.reduce((acc, c) => acc + c.balance, 0) || 0;
  const highRiskCount = customers?.filter(c => c.balance > c.credit_limit * 0.8).length || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Sales Ledger (AR)</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage customer receivables, credit limits, and collections.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white rounded-2xl shadow-premium border border-slate-100 text-sm font-bold text-slate-600 hover:text-sky-600 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Customer
          </button>
          <button className="px-4 py-2 bg-sky-600 text-white rounded-2xl shadow-premium text-sm font-bold hover:bg-sky-700 transition-all flex items-center gap-2">
            <FileText className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Receivables" value={`$${totalOutstanding.toLocaleString()}`} trend="+4.2% MoM" trendDirection="down" icon={<Users className="w-5 h-5 text-sky-500" />} onClick={() => {}} />
        <MetricCard title="Overdue (30+)" value="$42,500" trend="High Priority" trendDirection="down" icon={<AlertTriangle className="w-5 h-5 text-rose-500" />} onClick={() => {}} />
        <MetricCard title="Collection Ratio" value="94.2%" trend="+2.1%" trendDirection="up" icon={<CheckCircle className="w-5 h-5 text-emerald-500" />} onClick={() => {}} />
        <MetricCard title="Credit Risks" value={highRiskCount.toString()} trend="Critical" trendDirection="down" icon={<AlertTriangle className="w-5 h-5 text-amber-500" />} onClick={() => {}} />
      </div>

      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800">Customer Balances & Aging</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search customers..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all" />
             </div>
             <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-sky-600 transition-all">
                <Filter className="w-5 h-5" />
             </button>
             <button onClick={() => refetch()} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-sky-600 transition-all">
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credit Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Credit Limit</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Current Balance</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-8 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : (
                customers?.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <p className="text-sm font-bold text-slate-800">{customer.name}</p>
                       <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{customer.code}</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-xl tracking-wider ${
                         customer.balance > customer.credit_limit * 0.9 ? 'bg-rose-50 text-rose-600' : 
                         customer.balance > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                       }`}>
                         {customer.balance > customer.credit_limit ? 'Limit Exceeded' : customer.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono font-bold text-xs text-slate-400">
                       ${customer.credit_limit.toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-right font-mono font-bold text-sm text-slate-800">
                       ${customer.balance.toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                         onClick={() => { setPaymentModal({id: customer.id, name: customer.name}); setPaymentAmount(customer.balance); }}
                         disabled={customer.balance <= 0}
                         className="text-xs font-bold text-sky-600 hover:text-sky-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                       >
                         Receive Payment
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
           <div className="bg-white rounded-3xl shadow-premium w-full max-w-md overflow-hidden animate-slide-up">
              <div className="px-8 py-6 border-b border-slate-100">
                 <h3 className="text-xl font-bold text-slate-900">Record Receipt</h3>
                 <p className="text-sm text-slate-500">Allocating payment for {paymentModal.name}</p>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Receipt Amount</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                       <input 
                         type="number" 
                         value={paymentAmount}
                         onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500/20 outline-none font-mono font-bold text-lg" 
                       />
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setPaymentModal(null)} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                    <button 
                      onClick={() => receiptMutation.mutate({ entity_id: paymentModal.id, amount: paymentAmount, bank_account_id: 1 })}
                      className="flex-1 px-6 py-3 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 shadow-premium transition-all flex items-center justify-center gap-2"
                      disabled={receiptMutation.isPending}
                    >
                       {receiptMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                       Record
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
