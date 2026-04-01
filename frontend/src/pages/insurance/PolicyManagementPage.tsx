import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Shield, Loader2, CheckCircle2, XCircle, AlertTriangle, Clock,
  Search, RefreshCw, ChevronDown, ChevronUp, Eye, Play, Pause,
  RotateCcw, Ban, Award, FileText, DollarSign, Users, TrendingUp,
  Activity, Calendar, Download,
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import { useToast } from '../../components/ui/Toast';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  PROPOSAL: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600' },
  UNDERWRITING: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
  ACTIVE: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
  PAID_UP: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-700' },
  LAPSED: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700' },
  SURRENDERED: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  MATURED: { bg: 'bg-violet-50 border-violet-200', text: 'text-violet-700' },
  CANCELLED: { bg: 'bg-slate-50 border-slate-300', text: 'text-slate-500' },
  CLAIM_PENDING: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700' },
  CLAIM_SETTLED: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700' },
  REINSTATED: { bg: 'bg-lime-50 border-lime-200', text: 'text-lime-700' },
};

export const PolicyManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPolicy, setExpandedPolicy] = useState<number | null>(null);
  const [actionModal, setActionModal] = useState<{ policyId: number; action: string } | null>(null);
  const [selectedPolicies, setSelectedPolicies] = useState<number[]>([]);

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ['insurance-dashboard'],
    queryFn: financialApi.getInsuranceDashboard,
  });

  const { data: policiesData, refetch: refetchPolicies } = useQuery({
    queryKey: ['insurance-policies', filterStatus, filterProduct],
    queryFn: () => financialApi.listPolicies({
      status: filterStatus || undefined,
      product_type: filterProduct || undefined,
    }),
  });

  const { data: policyDetail } = useQuery({
    queryKey: ['insurance-policy-detail', expandedPolicy],
    queryFn: () => expandedPolicy ? financialApi.getPolicy(expandedPolicy) : null,
    enabled: !!expandedPolicy,
  });

  const { data: overduePremiums } = useQuery({
    queryKey: ['overdue-premiums'],
    queryFn: financialApi.getOverduePremiums,
  });

  const statusMutation = useMutation({
    mutationFn: ({ policyId, action }: { policyId: number; action: string }) =>
      financialApi.updatePolicyStatus(policyId, { action }),
    onSuccess: (data: any) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['insurance-policies'] });
      queryClient.invalidateQueries({ queryKey: ['insurance-dashboard'] });
      setActionModal(null);
    },
    onError: (err: any) => showToast(err?.response?.data?.detail || 'Action failed', 'error'),
  });

  const underwriteMutation = useMutation({
    mutationFn: ({ policyId, decision }: { policyId: number; decision: string }) =>
      financialApi.underwritePolicy(policyId, { decision }),
    onSuccess: (data: any) => {
      showToast(data.message, 'success');
      queryClient.invalidateQueries({ queryKey: ['insurance-policies'] });
      queryClient.invalidateQueries({ queryKey: ['insurance-dashboard'] });
    },
    onError: (err: any) => showToast(err?.response?.data?.detail || 'Underwriting failed', 'error'),
  });

  const getStatusStyle = (s: string) => STATUS_STYLES[s] || STATUS_STYLES.PROPOSAL;

  const stats = dashboard?.policies || {};
  const fins = dashboard?.financials || {};

  const filteredPolicies = (policiesData?.policies || [])
    .filter((p: any) => {
      if (searchQuery && !p.policy_number?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !p.plan_name?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-sky-500" />
            Policy Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Insurance & assurance portfolio — lifecycle, lapse tracking, premiums, underwriting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => financialApi.exportDataset('policies', 'csv')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-100 text-emerald-700 font-bold rounded-xl hover:bg-emerald-200 transition-all text-xs">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={() => { refetchPolicies(); queryClient.invalidateQueries({ queryKey: ['insurance-dashboard'] }); }}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-500 hover:text-sky-600 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Policies', value: stats.total || 0, icon: <FileText className="w-4 h-4" />, color: 'text-slate-600' },
          { label: 'Active', value: stats.active || 0, icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-600' },
          { label: 'Lapsed', value: stats.lapsed || 0, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-rose-600' },
          { label: 'Proposals', value: stats.proposals || 0, icon: <Clock className="w-4 h-4" />, color: 'text-amber-600' },
          { label: 'Matured', value: stats.matured || 0, icon: <Award className="w-4 h-4" />, color: 'text-violet-600' },
          { label: 'Overdue Premiums', value: dashboard?.overdue_premiums || 0, icon: <AlertTriangle className="w-4 h-4" />, color: 'text-orange-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-premium border border-slate-100 text-center">
            <div className={`flex justify-center mb-2 ${kpi.color}`}>{kpi.icon}</div>
            <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* ── Financials Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Sum Assured (Active)', value: fins.total_sum_assured || 0, icon: <Shield className="w-5 h-5 text-sky-500" /> },
          { label: 'Total Annual Premium (Active)', value: fins.total_annual_premium || 0, icon: <DollarSign className="w-5 h-5 text-emerald-500" /> },
          { label: 'Total Claims Paid', value: fins.total_claims_paid || 0, icon: <TrendingUp className="w-5 h-5 text-violet-500" /> },
        ].map((fin, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-2xl">{fin.icon}</div>
            <div>
              <p className="text-xl font-black text-slate-800">
                {fin.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{fin.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Overdue Premiums Alert ── */}
      {(overduePremiums?.overdue_premiums?.length ?? 0) > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" />
            Overdue Premiums — {overduePremiums.total} policies at risk of lapsing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {overduePremiums.overdue_premiums.slice(0, 6).map((op: any, i: number) => (
              <div key={i} className="bg-white rounded-xl p-3 border border-rose-100 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">{op.policy_number || `Policy #${op.policy_id}`}</span>
                  <span className={`font-bold ${op.auto_lapse_eligible ? 'text-rose-600' : 'text-amber-600'}`}>
                    {op.days_overdue}d overdue
                  </span>
                </div>
                <div className="flex justify-between mt-1 text-slate-500">
                  <span>Due: {op.amount?.toLocaleString()}</span>
                  <span>{op.in_grace_period ? 'In Grace Period' : 'Lapse Eligible'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Policy Table ── */}
      <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-500" />
            Policy Register
          </h2>
          <span className="text-xs text-slate-400">{policiesData?.total || 0} total</span>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search policies..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20 placeholder-slate-400"
            />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20">
            <option value="">All Statuses</option>
            {['PROPOSAL', 'UNDERWRITING', 'ACTIVE', 'PAID_UP', 'LAPSED', 'SURRENDERED', 'MATURED', 'CANCELLED', 'REINSTATED'].map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500/20">
            <option value="">All Products</option>
            {['LIFE', 'TERM', 'WHOLE_LIFE', 'ENDOWMENT', 'FUNERAL', 'GROUP_LIFE', 'ANNUITY', 'HEALTH', 'DISABILITY'].map(p => (
              <option key={p} value={p}>{p.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <button onClick={() => { setSearchQuery(''); setFilterStatus(''); setFilterProduct(''); }}
            className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs">
            Clear Filters
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedPolicies.length > 0 && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-sky-700">
              {selectedPolicies.length} policy{selectedPolicies.length > 1 ? 'ies' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => {
                selectedPolicies.forEach(id => statusMutation.mutate({ policyId: id, action: 'LAPSE' }));
                setSelectedPolicies([]);
              }}
                className="px-3 py-1.5 bg-rose-100 text-rose-700 font-bold rounded-lg hover:bg-rose-200 transition-all text-xs">
                Bulk Lapse
              </button>
              <button onClick={() => setSelectedPolicies([])}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-all text-xs">
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 font-semibold w-12">
                  <input
                    type="checkbox"
                    checked={selectedPolicies.length === filteredPolicies.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPolicies(filteredPolicies.map((p: any) => p.id));
                      } else {
                        setSelectedPolicies([]);
                      }
                    }}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                </th>
                <th className="px-3 py-3 font-semibold">Policy #</th>
                <th className="px-3 py-3 font-semibold">Product</th>
                <th className="px-3 py-3 font-semibold">Plan</th>
                <th className="px-3 py-3 font-semibold">Sum Assured</th>
                <th className="px-3 py-3 font-semibold">Premium</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Start</th>
                <th className="px-3 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.map((p: any) => {
                const ss = getStatusStyle(p.status);
                const isExpanded = expandedPolicy === p.id;
                return (
                  <React.Fragment key={p.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedPolicies.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPolicies([...selectedPolicies, p.id]);
                            } else {
                              setSelectedPolicies(selectedPolicies.filter(id => id !== p.id));
                            }
                          }}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                      </td>
                      <td className="px-3 py-3 font-mono text-xs font-bold text-slate-700">{p.policy_number}</td>
                      <td className="px-3 py-3 text-xs text-slate-600">{p.product_type.replace(/_/g, ' ')}</td>
                      <td className="px-3 py-3 text-xs text-slate-600 max-w-[140px] truncate">{p.plan_name}</td>
                      <td className="px-3 py-3 text-xs font-bold text-slate-700">
                        {p.currency} {p.sum_assured?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-600">
                        {p.currency} {p.annual_premium?.toLocaleString(undefined, { minimumFractionDigits: 2 })}/yr
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold border ${ss.bg} ${ss.text}`}>
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-400">
                        {p.start_date ? new Date(p.start_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {p.status === 'PROPOSAL' && (
                            <>
                              <button onClick={() => underwriteMutation.mutate({ policyId: p.id, decision: 'APPROVED' })}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all" title="Approve">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => underwriteMutation.mutate({ policyId: p.id, decision: 'DECLINED' })}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all" title="Decline">
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          {p.status === 'ACTIVE' && (
                            <>
                              <button onClick={() => statusMutation.mutate({ policyId: p.id, action: 'LAPSE' })}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all" title="Lapse">
                                <Pause className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => statusMutation.mutate({ policyId: p.id, action: 'PAID_UP' })}
                                className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 transition-all" title="Mark Paid-Up">
                                <Award className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          {p.status === 'LAPSED' && (
                            <button onClick={() => statusMutation.mutate({ policyId: p.id, action: 'REINSTATE' })}
                              className="p-1.5 rounded-lg bg-lime-50 hover:bg-lime-100 text-lime-600 transition-all" title="Reinstate">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {['PROPOSAL', 'ACTIVE', 'LAPSED'].includes(p.status) && (
                            <button onClick={() => statusMutation.mutate({ policyId: p.id, action: 'CANCEL' })}
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 transition-all" title="Cancel">
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => setExpandedPolicy(isExpanded ? null : p.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-violet-100 text-slate-500 hover:text-violet-600 transition-all" title="Details">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && policyDetail && (
                      <tr>
                        <td colSpan={9} className="bg-slate-50 px-6 py-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Beneficiaries */}
                            <div>
                              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-violet-500" /> Beneficiaries
                              </h4>
                              {(policyDetail.beneficiaries || []).length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No beneficiaries</p>
                              ) : (
                                <div className="space-y-1">
                                  {policyDetail.beneficiaries.map((b: any) => (
                                    <div key={b.id} className="bg-white rounded-lg p-2 border border-slate-200 text-xs">
                                      <span className="font-bold text-slate-700">{b.full_name}</span>
                                      <span className="text-slate-400 ml-1">({b.relationship_type})</span>
                                      <span className="float-right font-bold text-violet-600">{b.allocation_percent}%</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* Recent Premiums */}
                            <div>
                              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Recent Premiums
                              </h4>
                              {(policyDetail.premiums || []).length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No premiums generated yet</p>
                              ) : (
                                <div className="space-y-1">
                                  {policyDetail.premiums.slice(0, 5).map((pr: any) => (
                                    <div key={pr.id} className="flex justify-between bg-white rounded-lg p-2 border border-slate-200 text-xs">
                                      <span className="text-slate-500">{pr.due_date ? new Date(pr.due_date).toLocaleDateString() : '—'}</span>
                                      <span className="font-bold text-slate-700">{pr.amount?.toLocaleString()}</span>
                                      <span className={`font-bold ${pr.status === 'PAID' ? 'text-emerald-600' : pr.status === 'OVERDUE' ? 'text-rose-600' : 'text-amber-600'}`}>
                                        {pr.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* Claims */}
                            <div>
                              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-sky-500" /> Claims
                              </h4>
                              {(policyDetail.claims || []).length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No claims</p>
                              ) : (
                                <div className="space-y-1">
                                  {policyDetail.claims.map((c: any) => (
                                    <div key={c.id} className="bg-white rounded-lg p-2 border border-slate-200 text-xs">
                                      <span className="font-mono font-bold text-slate-700">{c.claim_number}</span>
                                      <span className="text-slate-400 ml-1">{c.claim_type}</span>
                                      <span className="float-right font-bold">{c.amount_claimed?.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Policy details footer */}
                          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-4 gap-4 text-xs text-slate-500">
                            <div><span className="font-bold">Underwriting:</span> {policyDetail.policy?.underwriting_status}</div>
                            <div><span className="font-bold">Grace Period:</span> {policyDetail.policy?.grace_period_days}d</div>
                            <div><span className="font-bold">Waiting Period:</span> {policyDetail.policy?.waiting_period_days}d</div>
                            <div><span className="font-bold">Agent:</span> {policyDetail.policy?.agent_code || '—'}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {policiesData?.policies?.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm italic">
              {searchQuery || filterStatus || filterProduct ? (
                <>
                  <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No policies match your filters.</p>
                  <button onClick={() => { setSearchQuery(''); setFilterStatus(''); setFilterProduct(''); }}
                    className="mt-2 text-sky-600 hover:text-sky-700 font-bold">
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No policies found. Enroll a new policy to get started.</p>
                  <button onClick={() => window.location.href = '/insurance/enroll'}
                    className="mt-2 text-sky-600 hover:text-sky-700 font-bold">
                    Enroll First Policy
                  </button>
                </>
              )}
            </div>
          ) : dashLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-slate-400" />
              <p className="text-slate-400 text-sm mt-2">Loading policies...</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
