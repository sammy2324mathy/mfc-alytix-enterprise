import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { complianceApi } from '../../services/complianceApi';
import { Download, FileText, CheckCircle, Lock, Send, Shield, AlertTriangle, Clock, FileSignature, XCircle, Loader2 } from 'lucide-react';

type FilingStatus = 'Drafting' | 'Under Review' | 'Submitted to Regulator' | 'Rejected';

interface ComplianceFiling {
  id: string;
  title: string;
  type: string;
  deadline: string;
  preparedBy: string;
  status: FilingStatus;
}

export const ReportsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isChiefCompliance = user?.roles.includes('admin') || user?.roles.includes('chief_compliance_officer');
  const isOfficer = user?.roles.includes('compliance_officer') || isChiefCompliance;
  const usernameFull = user?.roles.includes('admin') ? 'System Admin' : (isChiefCompliance ? 'Chief Compliance Officer' : 'Compliance Officer');

  const { data: filingsRaw, isLoading } = useQuery({
    queryKey: ['compliance-filings'],
    queryFn: complianceApi.listFilings
  });

  const filings = (Array.isArray(filingsRaw) ? filingsRaw : []).map(f => ({
    id: f.filing_id,
    title: f.regulation_name || 'Statutory Return',
    type: f.filing_type || 'Statutory',
    deadline: f.deadline || '2026-01-01',
    preparedBy: f.submitted_by || 'System',
    status: f.status === 'approved' ? 'Submitted to Regulator' : 
            f.status === 'submitted' ? 'Under Review' : 
            f.status === 'rejected' ? 'Rejected' : 'Drafting'
  })) as ComplianceFiling[];

  const [isDrafting, setIsDrafting] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftType, setDraftType] = useState('Statutory');
  const [draftDeadline, setDraftDeadline] = useState('');

  const { mutate: handleCreateFiling, isPending: isCreating } = useMutation({
    mutationFn: (data: any) => complianceApi.createFiling({
      filing_id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
      regulation_name: data.title,
      filing_type: data.type,
      deadline: data.deadline,
      status: 'draft',
      submitted_by: usernameFull
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-filings'] });
      setIsDrafting(false);
      setDraftTitle('');
      setDraftDeadline('');
    }
  });

  const { mutate: handleSubmitForReview, isPending: isSubmitting } = useMutation({
    mutationFn: (id: string) => complianceApi.submitFiling(id, usernameFull),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['compliance-filings'] })
  });

  const { mutate: handleSignAndSubmit, isPending: isApproving } = useMutation({
    mutationFn: (id: string) => complianceApi.approveFiling(id, usernameFull),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['compliance-filings'] })
  });

  const { mutate: handleReject, isPending: isRejecting } = useMutation({
    mutationFn: (id: string) => complianceApi.rejectFiling(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['compliance-filings'] })
  });

  const overdueCount = filings.filter(f => f.status !== 'Submitted to Regulator' && new Date(f.deadline) < new Date()).length;
  const pendingReview = filings.filter(f => f.status === 'Under Review').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Regulatory Compliance & Filings</h2>
          <p className="text-sm text-slate-500">
            Manage statutory returns, IFRS 17 disclosures, and ORSA reports. Officers draft; Chief Compliance Officer signs and files.
          </p>
        </div>
        <div className="flex gap-3">
          {!isDrafting && (
            <button onClick={() => setIsDrafting(true)} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-amber-700 transition flex items-center gap-2">
              <FileSignature className="w-4 h-4" /> New Filing
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Filings" value={filings.filter(f => f.status !== 'Submitted to Regulator').length.toString()} trend="In pipeline" trendDirection="neutral" icon={<FileText className="w-5 h-5" />} />
        <MetricCard title="Pending Chief Sign-off" value={pendingReview.toString()} trend={isChiefCompliance ? 'Requires your signature' : 'Awaiting CCO'} trendDirection={pendingReview > 0 ? 'down' : 'up'} icon={<Shield className="w-5 h-5" />} />
        <MetricCard title="Overdue Filings" value={overdueCount.toString()} trend={overdueCount > 0 ? 'Immediate action required' : 'On schedule'} trendDirection={overdueCount > 0 ? 'down' : 'up'} icon={<AlertTriangle className="w-5 h-5" />} />
        <MetricCard title="Next Deadline" value="Jan 15" trend="Q4 NAIC Statutory" trendDirection="neutral" icon={<Clock className="w-5 h-5" />} />
      </div>

      {isDrafting && (
        <div className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden ring-1 ring-amber-100">
          <div className="p-5 border-b border-amber-100 bg-amber-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-amber-900 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-amber-600" /> New Regulatory Filing
            </h3>
            <button onClick={() => setIsDrafting(false)} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Cancel</button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Filing Title</label>
              <input type="text" value={draftTitle} onChange={e => setDraftTitle(e.target.value)} placeholder="e.g. Q1 2026 Statutory NAIC Filing" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select value={draftType} onChange={e => setDraftType(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500">
                <option>Statutory</option>
                <option>Financial</option>
                <option>Risk</option>
                <option>Prudential</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Regulatory Deadline</label>
              <input type="date" value={draftDeadline} onChange={e => setDraftDeadline(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <div className="md:col-span-3 flex justify-end pt-2">
              <button 
                onClick={() => handleCreateFiling({ title: draftTitle, type: draftType, deadline: draftDeadline })} 
                disabled={!draftTitle || !draftDeadline || isCreating} 
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSignature className="w-4 h-4" />}
                Create Filing Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filing Queue */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Filing Pipeline</h3>
          {!isChiefCompliance && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Regulatory submission restricted to CCO
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">Filing ID</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Document</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Category</th>
                <th className="px-6 py-3 font-semibold text-slate-700">Deadline</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filings.map((filing) => (
                <tr key={filing.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">
                    <div>{filing.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">by {filing.preparedBy}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    {filing.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      filing.type === 'Statutory' ? 'bg-sky-100 text-sky-700' :
                      filing.type === 'Risk' ? 'bg-rose-100 text-rose-700' :
                      filing.type === 'Prudential' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>{filing.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={new Date(filing.deadline) < new Date() && filing.status !== 'Submitted to Regulator' ? 'text-rose-600 font-semibold' : ''}>
                      {filing.deadline}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      filing.status === 'Submitted to Regulator' ? 'bg-emerald-100 text-emerald-700' :
                      filing.status === 'Drafting' ? 'bg-slate-100 text-slate-600' :
                      filing.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>{filing.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {filing.status === 'Drafting' && (
                      <button onClick={() => handleSubmitForReview(filing.id)} className="text-xs font-semibold text-amber-600 hover:text-amber-800 flex items-center justify-end gap-1 ml-auto">
                        <Send className="w-3.5 h-3.5" /> Submit for CCO Review
                      </button>
                    )}
                    {filing.status === 'Under Review' && (
                      isChiefCompliance ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleSignAndSubmit(filing.id)} 
                            disabled={isApproving}
                            className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-xs font-semibold shadow-sm flex items-center gap-1"
                          >
                            {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                            Sign & File
                          </button>
                          <button 
                            onClick={() => handleReject(filing.id)} 
                            disabled={isRejecting}
                            className="text-rose-600 hover:text-rose-800 bg-rose-50 px-2 rounded transition-colors flex items-center gap-1"
                          >
                             {isRejecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                             Return
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] italic text-slate-400 flex items-center justify-end gap-1"><Lock className="w-3 h-3" /> CCO Must Sign</span>
                      )
                    )}
                    {filing.status === 'Submitted to Regulator' && (
                      <button className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center justify-end gap-1 ml-auto">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    )}
                    {filing.status === 'Rejected' && (
                      <span className="text-[11px] text-rose-500">Returned for revision</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
