import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreditCard, Loader2, CheckCircle2, XCircle, Clock, Search,
  Receipt, Shield, ArrowRight, DollarSign, FileText, RefreshCw,
  AlertTriangle, Eye, ChevronDown, ChevronUp, History
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import { useToast } from '../../components/ui/Toast';

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  completed: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: <Clock className="w-3.5 h-3.5" /> },
  processing: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-700', icon: <Loader2 className="w-3.5 h-3.5 animate-spin" /> },
  failed: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', icon: <XCircle className="w-3.5 h-3.5" /> },
  refunded: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', icon: <RefreshCw className="w-3.5 h-3.5" /> },
};

export const PaymentProcessingPage: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Payment form state
  const [policyId, setPolicyId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardToken, setCardToken] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [description, setDescription] = useState('');

  // Filters
  const [filterPolicy, setFilterPolicy] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Audit expansion
  const [expandedTxn, setExpandedTxn] = useState<string | null>(null);

  const { data: gatewayConfig } = useQuery({
    queryKey: ['payment-gateway-config'],
    queryFn: financialApi.getPaymentGatewayConfig,
  });

  const { data: paymentHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['payment-history', filterPolicy, filterStatus],
    queryFn: () => financialApi.getPaymentHistory(filterPolicy || undefined, filterStatus || undefined),
  });

  const { data: auditData } = useQuery({
    queryKey: ['payment-audit', expandedTxn],
    queryFn: () => expandedTxn ? financialApi.getPaymentAudit(expandedTxn) : null,
    enabled: !!expandedTxn,
  });

  const paymentMutation = useMutation({
    mutationFn: () =>
      financialApi.initiatePayment({
        policy_id: policyId,
        amount: parseFloat(amount),
        currency,
        payment_method: paymentMethod,
        card_token: cardToken,
        customer_email: customerEmail,
        description: description || undefined,
      }),
    onSuccess: (data: any) => {
      showToast(data.message || 'Payment processed', data.status === 'completed' ? 'success' : 'error');
      queryClient.invalidateQueries({ queryKey: ['payment-history'] });
      // Reset form
      setPolicyId('');
      setAmount('');
      setCardToken('');
      setDescription('');
    },
    onError: () => showToast('Payment processing failed', 'error'),
  });

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyId || !amount || !cardToken || !customerEmail) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (parseFloat(amount) <= 0) {
      showToast('Amount must be greater than zero', 'error');
      return;
    }
    paymentMutation.mutate();
  };

  const getStatusStyle = (status: string) => STATUS_STYLES[status] || STATUS_STYLES.pending;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-violet-500" />
            Payment Processing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Automated card payment processing with real-time ledger updates and policy activation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">
            <Shield className="w-3.5 h-3.5" />
            {gatewayConfig?.provider?.toUpperCase() || 'STRIPE'} Gateway
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Payment Form ── */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            Process Payment
          </h2>

          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Policy / Invoice ID *</label>
              <input
                type="text"
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
                placeholder="POL-2026-001"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20"
                >
                  {(gatewayConfig?.supported_currencies || ['USD', 'EUR', 'GBP', 'ZAR']).map((c: string) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Card Token *</label>
              <input
                type="text"
                value={cardToken}
                onChange={(e) => setCardToken(e.target.value)}
                placeholder="tok_xxxxxxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">Tokenized card data from Stripe Elements or similar</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Customer Email *</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Policy premium payment"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={paymentMutation.isPending}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {paymentMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {paymentMutation.isPending ? 'Processing...' : 'Process Payment'}
            </button>

            {paymentMutation.isSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  {(paymentMutation.data as any)?.message}
                </div>
                <p className="text-emerald-600 text-xs mt-1 font-mono">
                  Txn: {(paymentMutation.data as any)?.transaction_id}
                </p>
              </div>
            )}

            {paymentMutation.isError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm flex items-center gap-2 text-rose-700">
                <XCircle className="w-4 h-4" />
                Payment failed. Please check your details and try again.
              </div>
            )}
          </form>

          {/* How it works */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Automated Flow</h3>
            <div className="space-y-2">
              {[
                { icon: <CreditCard className="w-3.5 h-3.5" />, text: 'Card charged via payment gateway' },
                { icon: <Receipt className="w-3.5 h-3.5" />, text: 'Journal entry auto-posted to ledger' },
                { icon: <Shield className="w-3.5 h-3.5" />, text: 'Policy status updated to Active' },
                { icon: <FileText className="w-3.5 h-3.5" />, text: 'Full audit trail recorded' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-6 h-6 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  {step.text}
                  {i < 3 && <ArrowRight className="w-3 h-3 text-slate-300 ml-auto" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Transaction History ── */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-sky-500" />
              Transaction History
            </h2>
            <button
              onClick={() => refetchHistory()}
              className="p-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-600 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={filterPolicy}
                onChange={(e) => setFilterPolicy(e.target.value)}
                placeholder="Filter by policy ID"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 font-semibold">Transaction</th>
                  <th className="px-3 py-3 font-semibold">Policy</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                  <th className="px-3 py-3 font-semibold">Method</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Ledger</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(paymentHistory?.payments || []).map((p: any) => {
                  const ss = getStatusStyle(p.status);
                  const isExpanded = expandedTxn === p.transaction_id;
                  return (
                    <React.Fragment key={p.transaction_id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-3 font-mono text-xs text-slate-600 truncate max-w-[120px]">
                          {p.transaction_id}
                        </td>
                        <td className="px-3 py-3 font-medium text-slate-700 text-xs">{p.policy_id}</td>
                        <td className="px-3 py-3 font-bold text-slate-800 text-xs">
                          {p.currency} {p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-500 capitalize">
                          {p.payment_method.replace(/_/g, ' ')}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border ${ss.bg} ${ss.text}`}>
                            {ss.icon}
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {p.ledger_posted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-400">
                          {new Date(p.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={() => setExpandedTxn(isExpanded ? null : p.transaction_id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-500 hover:text-violet-600 transition-all"
                            title="View audit trail"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && auditData && (
                        <tr>
                          <td colSpan={8} className="bg-slate-50 px-6 py-4">
                            <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                              <FileText className="w-3.5 h-3.5 text-violet-500" />
                              Audit Trail — {p.transaction_id}
                            </h4>
                            <div className="space-y-2">
                              {(auditData.events || []).map((evt: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 text-xs">
                                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-1 flex-shrink-0" />
                                  <div>
                                    <span className="font-bold text-slate-700">{evt.event}</span>
                                    {evt.gateway_reference && (
                                      <span className="text-slate-400 ml-2 font-mono">ref: {evt.gateway_reference}</span>
                                    )}
                                    {evt.new_status && (
                                      <span className="text-emerald-600 ml-2 font-bold">→ {evt.new_status}</span>
                                    )}
                                    <span className="text-slate-400 ml-2">{new Date(evt.timestamp).toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-4 text-xs text-slate-500">
                              <div><span className="font-bold">Email:</span> {auditData.customer_email}</div>
                              <div><span className="font-bold">Gateway Ref:</span> {auditData.gateway_reference || '—'}</div>
                              <div><span className="font-bold">Updated:</span> {new Date(auditData.updated_at).toLocaleString()}</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {(!paymentHistory?.payments || paymentHistory.payments.length === 0) && (
              <div className="text-center py-12 text-slate-400 text-sm italic">
                No payment transactions yet. Process a payment above to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Webhook Info */}
      <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-sky-500" />
          Webhook & Gateway Configuration
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-600 mb-1">Payment Provider</p>
            <p className="text-sm font-mono text-slate-800">{gatewayConfig?.provider || 'stripe'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-600 mb-1">Webhook Endpoint</p>
            <p className="text-sm font-mono text-slate-800">{gatewayConfig?.webhook_url || '/accounting/payments/webhook/stripe'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-600 mb-1">Supported Methods</p>
            <p className="text-sm text-slate-800 capitalize">
              {(gatewayConfig?.supported_methods || ['credit_card', 'debit_card']).join(', ').replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          Configure your Stripe dashboard webhook to point to the endpoint above. The system will automatically verify signatures, 
          record ledger entries, and update policy statuses on <code className="bg-slate-100 px-1 py-0.5 rounded">charge.succeeded</code>, 
          <code className="bg-slate-100 px-1 py-0.5 rounded">charge.refunded</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded">charge.failed</code> events.
        </div>
      </div>
    </div>
  );
};
