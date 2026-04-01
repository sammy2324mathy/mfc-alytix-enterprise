import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText, Loader2, CheckCircle2, XCircle, AlertTriangle, Clock,
  Search, RefreshCw, Eye, ChevronUp, DollarSign, Gavel, Send,
  ShieldCheck, Ban,
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import { useToast } from '../../components/ui/Toast';

const CLAIM_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  SUBMITTED: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  UNDER_REVIEW: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-700' },
  APPROVED: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  DECLINED: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
  PAID: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
  CONTESTED: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
};

export const ClaimsManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);

  // New claim form
  const [showNewClaim, setShowNewClaim] = useState(false);
  const [claimPolicyId, setClaimPolicyId] = useState('');
  const [claimType, setClaimType] = useState('DEATH');
  const [claimDate, setClaimDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [docsReceived, setDocsReceived] = useState('no');

  // Assessment form
  const [assessingClaim, setAssessingClaim] = useState<number | null>(null);
  const [assessDecision, setAssessDecision] = useState('APPROVED');
  const [assessAmount, setAssessAmount] = useState('');
  const [assessNotes, setAssessNotes] = useState('');
  const [declineReason, setDeclineReason] = useState('');

  const { data: claimsData, refetch: refetchClaims } = useQuery({
    queryKey: ['insurance-claims', filterStatus, filterType],
    queryFn: () => financialApi.listClaims({
      status: filterStatus || undefined,
      claim_type: filterType || undefined,
    }),
  });

  const { data: claimDetail } = useQuery({
    queryKey: ['insurance-claim-detail', expandedClaim],
    queryFn: () => expandedClaim ? financialApi.getClaim(expandedClaim) : null,
    enabled: !!expandedClaim,
  });

  const submitClaimMutation = useMutation({
    mutationFn: () =>
      financialApi.submitClaim(parseInt(claimPolicyId), {
        claim_type: claimType,
        claim_date: claimDate,
        amount_claimed: parseFloat(claimAmount),
        documents_received: docsReceived,
      }),
    onSuccess: (data: any) => {
      showToast(`Claim ${data.claim?.claim_number} submitted`, 'success');
      queryClient.invalidateQueries({ queryKey: ['insurance-claims'] });
      setShowNewClaim(false);
      setClaimPolicyId(''); setClaimDate(''); setClaimAmount('');
    },
    onError: (err: any) => showToast(err?.response?.data?.detail || 'Submission failed', 'error'),
  });

  const assessMutation = useMutation({
    mutationFn: (claimId: number) =>
      financialApi.assessClaim(claimId, {
        decision: assessDecision,
        amount_approved: assessDecision === 'APPROVED' ? parseFloat(assessAmount) || undefined : undefined,
        assessor_notes: assessNotes || undefined,
        decline_reason: assessDecision === 'DECLINED' ? declineReason || undefined : undefined,
      }),
    onSuccess: (data: any) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['insurance-claims'] });
      setAssessingClaim(null);
      setAssessNotes(''); setAssessAmount(''); setDeclineReason('');
    },
    onError: (err: any) => showToast(err?.response?.data?.detail || 'Assessment failed', 'error'),
  });

  const settleMutation = useMutation({
    mutationFn: (claimId: number) => financialApi.settleClaim(claimId),
    onSuccess: (data: any) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['insurance-claims'] });
    },
    onError: (err: any) => showToast(err?.response?.data?.detail || 'Settlement failed', 'error'),
  });

  const getStatusStyle = (s: string) => CLAIM_STATUS_STYLES[s] || CLAIM_STATUS_STYLES.SUBMITTED;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Gavel className="w-8 h-8 text-indigo-500" />
            Claims Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit, assess, and settle insurance claims — death, maturity, disability, hospital, funeral
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNewClaim(!showNewClaim)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg text-xs">
            <Send className="w-3.5 h-3.5" /> New Claim
          </button>
          <button onClick={() => refetchClaims()}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-600 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── New Claim Form ── */}
      {showNewClaim && (
        <div className="bg-white rounded-3xl p-8 shadow-premium border border-indigo-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Send className="w-5 h-5 text-indigo-500" /> Submit New Claim
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Policy ID *</label>
              <input type="number" value={claimPolicyId} onChange={e => setClaimPolicyId(e.target.value)}
                placeholder="e.g. 1" required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Claim Type *</label>
              <select value={claimType} onChange={e => setClaimType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20">
                <option value="DEATH">Death</option>
                <option value="MATURITY">Maturity</option>
                <option value="DISABILITY">Disability</option>
                <option value="HOSPITAL">Hospital</option>
                <option value="RETRENCHMENT">Retrenchment</option>
                <option value="FUNERAL">Funeral</option>
                <option value="CRITICAL_ILLNESS">Critical Illness</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Claim Date *</label>
              <input type="date" value={claimDate} onChange={e => setClaimDate(e.target.value)} required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Amount Claimed *</label>
              <input type="number" step="0.01" min="1" value={claimAmount} onChange={e => setClaimAmount(e.target.value)}
                placeholder="500000.00" required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Documents?</label>
              <select value={docsReceived} onChange={e => setDocsReceived(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20">
                <option value="no">Not Yet</option>
                <option value="yes">Received</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowNewClaim(false)}
              className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs">
              Cancel
            </button>
            <button onClick={() => submitClaimMutation.mutate()} disabled={submitClaimMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg text-xs disabled:opacity-50">
              {submitClaimMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Submit Claim
            </button>
          </div>
        </div>
      )}

      {/* ── Claims Table ── */}
      <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
        {/* Filters */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20">
            <option value="">All Statuses</option>
            {['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'DECLINED', 'PAID', 'CONTESTED'].map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20">
            <option value="">All Claim Types</option>
            {['DEATH', 'MATURITY', 'DISABILITY', 'HOSPITAL', 'RETRENCHMENT', 'FUNERAL', 'CRITICAL_ILLNESS'].map(t => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 font-semibold">Claim #</th>
                <th className="px-3 py-3 font-semibold">Type</th>
                <th className="px-3 py-3 font-semibold">Claim Date</th>
                <th className="px-3 py-3 font-semibold">Amount Claimed</th>
                <th className="px-3 py-3 font-semibold">Approved</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Docs</th>
                <th className="px-3 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(claimsData?.claims || []).map((c: any) => {
                const ss = getStatusStyle(c.status);
                const isExpanded = expandedClaim === c.id;
                const isAssessing = assessingClaim === c.id;
                return (
                  <React.Fragment key={c.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3 font-mono text-xs font-bold text-slate-700">{c.claim_number}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{c.claim_type.replace(/_/g, ' ')}</td>
                      <td className="px-3 py-3 text-xs text-slate-500">
                        {c.claim_date ? new Date(c.claim_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-3 py-3 text-xs font-bold text-slate-700">
                        {c.amount_claimed?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-3 text-xs font-bold text-emerald-600">
                        {c.amount_approved ? c.amount_approved.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold border ${ss.bg} ${ss.text}`}>
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {c.documents_received === 'yes' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {['SUBMITTED', 'UNDER_REVIEW'].includes(c.status) && (
                            <button onClick={() => { setAssessingClaim(isAssessing ? null : c.id); setAssessAmount(String(c.amount_claimed)); }}
                              className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all" title="Assess">
                              <Gavel className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {c.status === 'APPROVED' && (
                            <button onClick={() => settleMutation.mutate(c.id)} disabled={settleMutation.isPending}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all" title="Settle & Pay">
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => setExpandedClaim(isExpanded ? null : c.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-500 hover:text-violet-600 transition-all" title="Details">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Assessment panel */}
                    {isAssessing && (
                      <tr>
                        <td colSpan={8} className="bg-indigo-50/50 px-6 py-4">
                          <h4 className="text-xs font-bold text-indigo-700 mb-3 flex items-center gap-2">
                            <Gavel className="w-3.5 h-3.5" /> Assess Claim {c.claim_number}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">Decision</label>
                              <select value={assessDecision} onChange={e => setAssessDecision(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="APPROVED">Approve</option>
                                <option value="DECLINED">Decline</option>
                                <option value="CONTESTED">Contest</option>
                              </select>
                            </div>
                            {assessDecision === 'APPROVED' && (
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Approved Amount</label>
                                <input type="number" step="0.01" value={assessAmount} onChange={e => setAssessAmount(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20" />
                              </div>
                            )}
                            {assessDecision === 'DECLINED' && (
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Decline Reason</label>
                                <input type="text" value={declineReason} onChange={e => setDeclineReason(e.target.value)}
                                  placeholder="Reason for decline"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20" />
                              </div>
                            )}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">Assessor Notes</label>
                              <input type="text" value={assessNotes} onChange={e => setAssessNotes(e.target.value)}
                                placeholder="Optional notes"
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div className="flex items-end gap-2">
                              <button onClick={() => assessMutation.mutate(c.id)} disabled={assessMutation.isPending}
                                className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all text-xs disabled:opacity-50">
                                {assessMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                                Confirm
                              </button>
                              <button onClick={() => setAssessingClaim(null)}
                                className="px-3 py-2.5 bg-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-300 transition-all text-xs">
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Expanded details */}
                    {isExpanded && claimDetail && (
                      <tr>
                        <td colSpan={8} className="bg-slate-50 px-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                            <div>
                              <span className="font-bold text-slate-600">Policy:</span>
                              <span className="ml-1 text-slate-500">{claimDetail.policy?.policy_number || '—'}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-600">Product:</span>
                              <span className="ml-1 text-slate-500">{claimDetail.policy?.product_type || '—'}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-600">Sum Assured:</span>
                              <span className="ml-1 text-slate-500">{claimDetail.policy?.sum_assured?.toLocaleString() || '—'}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-600">Reported:</span>
                              <span className="ml-1 text-slate-500">
                                {claimDetail.claim?.reported_date ? new Date(claimDetail.claim.reported_date).toLocaleDateString() : '—'}
                              </span>
                            </div>
                            {claimDetail.claim?.assessor_notes && (
                              <div className="col-span-2">
                                <span className="font-bold text-slate-600">Assessor Notes:</span>
                                <span className="ml-1 text-slate-500">{claimDetail.claim.assessor_notes}</span>
                              </div>
                            )}
                            {claimDetail.claim?.decline_reason && (
                              <div className="col-span-2">
                                <span className="font-bold text-rose-600">Decline Reason:</span>
                                <span className="ml-1 text-rose-500">{claimDetail.claim.decline_reason}</span>
                              </div>
                            )}
                            {claimDetail.claim?.settlement_date && (
                              <div>
                                <span className="font-bold text-slate-600">Settlement Date:</span>
                                <span className="ml-1 text-teal-600">{new Date(claimDetail.claim.settlement_date).toLocaleDateString()}</span>
                              </div>
                            )}
                            {claimDetail.claim?.amount_paid && (
                              <div>
                                <span className="font-bold text-slate-600">Amount Paid:</span>
                                <span className="ml-1 font-bold text-teal-600">{claimDetail.claim.amount_paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {(!claimsData?.claims || claimsData.claims.length === 0) && (
            <div className="text-center py-12 text-slate-400 text-sm italic">
              No claims found. Submit a new claim to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
