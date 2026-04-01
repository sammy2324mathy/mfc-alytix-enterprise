import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileSignature, Loader2, CheckCircle2, XCircle, Plus, Trash2,
  UserPlus, Shield, Calendar, DollarSign, Users, ChevronDown,
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import { useToast } from '../../components/ui/Toast';

interface BeneficiaryForm {
  full_name: string;
  relationship_type: string;
  id_number: string;
  phone: string;
  allocation_percent: number;
  is_primary: string;
}

const EMPTY_BENEFICIARY: BeneficiaryForm = {
  full_name: '', relationship_type: 'SPOUSE', id_number: '', phone: '', allocation_percent: 100, is_primary: 'yes',
};

export const PolicyEnrollmentPage: React.FC = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Form state
  const [customerId, setCustomerId] = useState('');
  const [productType, setProductType] = useState('LIFE');
  const [planName, setPlanName] = useState('');
  const [sumAssured, setSumAssured] = useState('');
  const [annualPremium, setAnnualPremium] = useState('');
  const [premiumFrequency, setPremiumFrequency] = useState('MONTHLY');
  const [currency, setCurrency] = useState('USD');
  const [startDate, setStartDate] = useState('');
  const [termYears, setTermYears] = useState('20');
  const [gracePeriod, setGracePeriod] = useState('30');
  const [waitingPeriod, setWaitingPeriod] = useState('90');
  const [agentCode, setAgentCode] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryForm[]>([{ ...EMPTY_BENEFICIARY }]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: productTypes } = useQuery({
    queryKey: ['insurance-product-types'],
    queryFn: financialApi.getProductTypes,
  });

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => financialApi.getCustomers(),
  });

  const enrollMutation = useMutation({
    mutationFn: () =>
      financialApi.enrollPolicy({
        customer_id: parseInt(customerId),
        product_type: productType,
        plan_name: planName,
        sum_assured: parseFloat(sumAssured),
        annual_premium: parseFloat(annualPremium),
        premium_frequency: premiumFrequency,
        currency,
        start_date: startDate,
        term_years: termYears ? parseInt(termYears) : undefined,
        grace_period_days: parseInt(gracePeriod),
        waiting_period_days: parseInt(waitingPeriod),
        agent_code: agentCode || undefined,
        branch_code: branchCode || undefined,
        beneficiaries: beneficiaries.filter(b => b.full_name.trim()).map(b => ({
          ...b,
          id_number: b.id_number || undefined,
          phone: b.phone || undefined,
        })),
      }),
    onSuccess: (data: any) => {
      showToast(`Policy ${data.policy?.policy_number} enrolled successfully`, 'success');
      queryClient.invalidateQueries({ queryKey: ['insurance-policies'] });
      // Reset form
      setCustomerId(''); setPlanName(''); setSumAssured(''); setAnnualPremium('');
      setStartDate(''); setAgentCode(''); setBranchCode('');
      setBeneficiaries([{ ...EMPTY_BENEFICIARY }]);
    },
    onError: (err: any) => {
      showToast(err?.response?.data?.detail || 'Enrollment failed', 'error');
    },
  });

  const addBeneficiary = () => {
    setBeneficiaries(prev => [...prev, { ...EMPTY_BENEFICIARY, allocation_percent: 0, is_primary: 'no' }]);
  };

  const removeBeneficiary = (idx: number) => {
    setBeneficiaries(prev => prev.filter((_, i) => i !== idx));
  };

  const updateBeneficiary = (idx: number, field: keyof BeneficiaryForm, value: string | number) => {
    setBeneficiaries(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !planName || !sumAssured || !annualPremium || !startDate) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    const validBens = beneficiaries.filter(b => b.full_name.trim());
    if (validBens.length > 0) {
      const totalAlloc = validBens.reduce((s, b) => s + b.allocation_percent, 0);
      if (Math.abs(totalAlloc - 100) > 0.01) {
        showToast(`Beneficiary allocations must total 100%. Currently ${totalAlloc}%`, 'error');
        return;
      }
    }
    enrollMutation.mutate();
  };

  const allProducts = productTypes?.product_types || [
    { code: 'LIFE', name: 'Life Insurance', category: 'insurance' },
    { code: 'TERM', name: 'Term Life Insurance', category: 'insurance' },
    { code: 'WHOLE_LIFE', name: 'Whole Life Insurance', category: 'insurance' },
    { code: 'ENDOWMENT', name: 'Endowment Plan', category: 'assurance' },
    { code: 'FUNERAL', name: 'Funeral Cover', category: 'insurance' },
    { code: 'GROUP_LIFE', name: 'Group Life Cover', category: 'insurance' },
    { code: 'ANNUITY', name: 'Annuity', category: 'assurance' },
    { code: 'HEALTH', name: 'Health Insurance', category: 'insurance' },
    { code: 'DISABILITY', name: 'Disability Insurance', category: 'insurance' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <FileSignature className="w-8 h-8 text-emerald-500" />
          Policy Registration & Enrollment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Enroll new insurance and assurance policies — life, endowment, funeral, health, disability, annuity
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Policy Details ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-sky-500" />
                Policy Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Customer *</label>
                  <select value={customerId} onChange={e => setCustomerId(e.target.value)} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all">
                    <option value="">Select Customer</option>
                    {customers?.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code}) - ID: {c.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Product Type *</label>
                  <select value={productType} onChange={e => setProductType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20">
                    <optgroup label="Insurance">
                      {allProducts.filter((p: any) => p.category === 'insurance').map((p: any) => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Assurance">
                      {allProducts.filter((p: any) => p.category === 'assurance').map((p: any) => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Plan Name *</label>
                  <input type="text" value={planName} onChange={e => setPlanName(e.target.value)}
                    placeholder="e.g. Executive Life Cover Plus" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Sum Assured *</label>
                  <input type="number" step="0.01" min="1" value={sumAssured} onChange={e => setSumAssured(e.target.value)}
                    placeholder="500000.00" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Annual Premium *</label>
                  <input type="number" step="0.01" min="1" value={annualPremium} onChange={e => setAnnualPremium(e.target.value)}
                    placeholder="12000.00" required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Premium Frequency</label>
                  <select value={premiumFrequency} onChange={e => setPremiumFrequency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20">
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="SEMI_ANNUAL">Semi-Annual</option>
                    <option value="ANNUAL">Annual</option>
                    <option value="SINGLE">Single Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Currency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="ZAR">ZAR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Start Date *</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Term (Years)</label>
                  <input type="number" min="1" max="100" value={termYears} onChange={e => setTermYears(e.target.value)}
                    placeholder="20"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all" />
                </div>
              </div>

              {/* Advanced Options */}
              <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
                className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-sky-600 transition-all">
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                Advanced Options
              </button>
              {showAdvanced && (
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Grace Period (Days)</label>
                    <input type="number" min="0" max="180" value={gracePeriod} onChange={e => setGracePeriod(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Waiting Period (Days)</label>
                    <input type="number" min="0" max="730" value={waitingPeriod} onChange={e => setWaitingPeriod(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Agent Code</label>
                    <input type="text" value={agentCode} onChange={e => setAgentCode(e.target.value)} placeholder="AGT-001"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Branch Code</label>
                    <input type="text" value={branchCode} onChange={e => setBranchCode(e.target.value)} placeholder="BR-JHB-01"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
                </div>
              )}
            </div>

            {/* ── Beneficiaries ── */}
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-500" />
                  Beneficiaries
                </h2>
                <button type="button" onClick={addBeneficiary}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-xl text-xs font-bold text-violet-700 hover:bg-violet-100 transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add Beneficiary
                </button>
              </div>

              <div className="space-y-4">
                {beneficiaries.map((ben, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 relative">
                    {beneficiaries.length > 1 && (
                      <button type="button" onClick={() => removeBeneficiary(idx)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-500 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Full Name *</label>
                        <input type="text" value={ben.full_name}
                          onChange={e => updateBeneficiary(idx, 'full_name', e.target.value)}
                          placeholder="Full Name"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Relationship *</label>
                        <select value={ben.relationship_type}
                          onChange={e => updateBeneficiary(idx, 'relationship_type', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20">
                          <option value="SPOUSE">Spouse</option>
                          <option value="CHILD">Child</option>
                          <option value="PARENT">Parent</option>
                          <option value="SIBLING">Sibling</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Allocation %</label>
                        <input type="number" min="0" max="100" step="0.01" value={ben.allocation_percent}
                          onChange={e => updateBeneficiary(idx, 'allocation_percent', parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">ID / Passport Number</label>
                        <input type="text" value={ben.id_number}
                          onChange={e => updateBeneficiary(idx, 'id_number', e.target.value)}
                          placeholder="Optional"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Phone</label>
                        <input type="text" value={ben.phone}
                          onChange={e => updateBeneficiary(idx, 'phone', e.target.value)}
                          placeholder="Optional"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Primary?</label>
                        <select value={ben.is_primary}
                          onChange={e => updateBeneficiary(idx, 'is_primary', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-violet-500/20">
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar Summary & Submit ── */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-premium border border-slate-100 sticky top-8">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-emerald-500" />
                Enrollment Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Product</span><span className="font-bold text-slate-700">{productType}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Sum Assured</span><span className="font-bold text-slate-700">{currency} {sumAssured ? parseFloat(sumAssured).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Annual Premium</span><span className="font-bold text-slate-700">{currency} {annualPremium ? parseFloat(annualPremium).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Frequency</span><span className="font-bold text-slate-700 capitalize">{premiumFrequency.toLowerCase().replace('_', '-')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Term</span><span className="font-bold text-slate-700">{termYears ? `${termYears} years` : 'Whole Life'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Beneficiaries</span><span className="font-bold text-slate-700">{beneficiaries.filter(b => b.full_name).length}</span></div>
                {annualPremium && premiumFrequency !== 'SINGLE' && premiumFrequency !== 'ANNUAL' && (
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Installment</span>
                      <span className="font-bold text-emerald-600">
                        {currency} {(parseFloat(annualPremium) / (premiumFrequency === 'MONTHLY' ? 12 : premiumFrequency === 'QUARTERLY' ? 4 : 2)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={enrollMutation.isPending}
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3.5 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                {enrollMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSignature className="w-4 h-4" />}
                {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Policy'}
              </button>

              {enrollMutation.isSuccess && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Policy Enrolled
                  </div>
                  <p className="text-emerald-600 text-xs mt-1 font-mono">
                    {(enrollMutation.data as any)?.policy?.policy_number}
                  </p>
                  <p className="text-emerald-600 text-xs mt-0.5">
                    Status: PROPOSAL — awaiting underwriting
                  </p>
                </div>
              )}

              {enrollMutation.isError && (
                <div className="mt-4 bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm flex items-center gap-2 text-rose-700">
                  <XCircle className="w-4 h-4" /> Enrollment failed. Check details.
                </div>
              )}
            </div>

            {/* Workflow info */}
            <div className="bg-white rounded-3xl p-6 shadow-premium border border-slate-100">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Policy Lifecycle</h3>
              <div className="space-y-2">
                {[
                  { label: 'Proposal', desc: 'Policy created, pending review', color: 'bg-slate-400' },
                  { label: 'Underwriting', desc: 'Risk assessment in progress', color: 'bg-amber-400' },
                  { label: 'Active', desc: 'Approved, premiums collecting', color: 'bg-emerald-400' },
                  { label: 'Paid-Up', desc: 'All premiums received', color: 'bg-sky-400' },
                  { label: 'Lapsed', desc: 'Premiums overdue beyond grace', color: 'bg-rose-400' },
                  { label: 'Matured', desc: 'Term completed, benefit payable', color: 'bg-violet-400' },
                  { label: 'Claim Settled', desc: 'Claim paid, policy closed', color: 'bg-indigo-400' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <div className={`w-2.5 h-2.5 rounded-full ${step.color} flex-shrink-0`} />
                    <div>
                      <span className="font-bold text-slate-700">{step.label}</span>
                      <span className="text-slate-400 ml-1">— {step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
