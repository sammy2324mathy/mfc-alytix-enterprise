import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialApi, Supplier } from '../../services/financialApi';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { Building2, AlertOctagon, CheckSquare, Clock, Banknote, ShieldAlert, Plus, Search, Filter, RefreshCw, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const APPage: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const isAdminOrChief = user?.roles.includes('admin') || user?.roles.includes('chief_accountant');
  
  const [paymentModal, setPaymentModal] = useState<{id: number, name: string} | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const { data: suppliers, isLoading, refetch } = useQuery({
    queryKey: ['ap-suppliers'],
    queryFn: () => financialApi.getSuppliers()
  });

  const paymentMutation = useMutation({
    mutationFn: financialApi.postSupplierPayment,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ap-suppliers'] });
        showToast('Supplier payment recorded successfully', 'success');
        setPaymentModal(null);
    },
    onError: () => showToast('Failed to record payment', 'error')
  });

  const totalPayable = suppliers?.reduce((acc, s) => acc + s.balance, 0) || 0;
  const onHoldCount = suppliers?.filter(s => s.status === 'on_hold').length || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Purchase Ledger (AP)</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage vendor obligations, supplier bills, and disbursements.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white rounded-2xl shadow-premium border border-slate-100 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-2xl shadow-premium text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Banknote className="w-4 h-4" /> Enter Bill
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Accounts Payable" value={`$${totalPayable.toLocaleString()}`} trend="6 Bills Due" trendDirection="neutral" icon={<Building2 className="w-5 h-5 text-indigo-500" />} onClick={() => {}} />
        <MetricCard title="Awaiting Approval" value="$105,000" trend="2 Items" trendDirection="down" icon={<ShieldAlert className="w-5 h-5 text-amber-500" />} onClick={() => {}} />
        <MetricCard title="On Hold" value={onHoldCount.toString()} trend="Vendor Disputes" trendDirection="down" icon={<AlertOctagon className="w-5 h-5 text-rose-500" />} onClick={() => {}} />
        <MetricCard title="Early Discounts" value="$1,250" trend="Available" trendDirection="up" icon={<Clock className="w-5 h-5 text-emerald-500" />} onClick={() => {}} />
      </div>

      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold text-slate-800">Supplier Ledger & Remittances</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search suppliers..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
             </div>
             <button onClick={() => refetch()} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supplier</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terms</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Balance Owed</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-8 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : (
                suppliers?.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                       <p className="text-sm font-bold text-slate-800">{supplier.name}</p>
                       <p className="text-[10px] text-slate-400 font-mono font-bold uppercase">{supplier.code}</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">Net {supplier.payment_terms_days} Days</span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-xl tracking-wider ${
                         supplier.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 
                         supplier.status === 'on_hold' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                       }`}>
                         {supplier.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right font-mono font-bold text-sm text-slate-800">
                       ${supplier.balance.toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <button 
                            disabled={supplier.balance <= 0 || supplier.status === 'on_hold'}
                            onClick={() => { setPaymentModal({id: supplier.id, name: supplier.name}); setPaymentAmount(supplier.balance); }}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            Release Funds
                          </button>
                       </div>
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
                 <h3 className="text-xl font-bold text-slate-900">Execute Payment</h3>
                 <p className="text-sm text-slate-500">Approving disbursement for {paymentModal.name}</p>
              </div>
              <div className="p-8 space-y-6">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Amount</label>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                       <input 
                         type="number" 
                         value={paymentAmount}
                         onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                         className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono font-bold text-lg" 
                       />
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setPaymentModal(null)} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                    <button 
                      onClick={() => paymentMutation.mutate({ entity_id: paymentModal.id, amount: paymentAmount, bank_account_id: 1 })}
                      className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-premium transition-all flex items-center justify-center gap-2"
                      disabled={paymentMutation.isPending}
                    >
                       {paymentMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
                       Authorize
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
