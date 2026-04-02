import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { BarChart3, CheckCircle, Lock, Send, XCircle, FileSignature, Settings2, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

type AssumptionStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Superseded';

interface Assumption {
  id: string;
  category: string;
  parameter: string;
  currentValue: string;
  proposedValue: string;
  basis: string;
  submittedBy: string;
  status: AssumptionStatus;
  effectiveDate: string;
}

export const AssumptionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const isChief = user?.roles.includes('chief_actuary') || user?.roles.includes('admin');

  const [assumptions, setAssumptions] = useState<Assumption[]>([
    { id: 'ASM-042', category: 'Mortality', parameter: 'Best Estimate qx Adjustment', currentValue: '+0%', proposedValue: '-3%', basis: 'Based on 2022-2024 experience investigation', submittedBy: 'Actuarial Analyst', status: 'Pending Approval', effectiveDate: '2026-01-01' },
    { id: 'ASM-041', category: 'Lapse', parameter: 'Voluntary Lapse Rate (Year 1-3)', currentValue: '12%', proposedValue: '14%', basis: 'Increased lapses observed in high-inflation environment', submittedBy: 'Actuarial Analyst', status: 'Pending Approval', effectiveDate: '2026-01-01' },
    { id: 'ASM-040', category: 'Expense', parameter: 'Maintenance Expense per Policy', currentValue: 'R185', proposedValue: 'R210', basis: 'CPI + salary inflation adjustment for 2026', submittedBy: 'Chief Actuary', status: 'Approved', effectiveDate: '2025-07-01' },
    { id: 'ASM-038', category: 'Discount', parameter: 'Risk-Free Yield Curve', currentValue: 'SA Gov Bond', proposedValue: 'SA Gov Bond (updated)', basis: 'SARB Dec 2025 curve recalibration', submittedBy: 'Chief Actuary', status: 'Approved', effectiveDate: '2025-12-31' },
    { id: 'ASM-035', category: 'Morbidity', parameter: 'Disability Inception Rate', currentValue: '0.45%', proposedValue: '0.52%', basis: 'Industry-wide deterioration post-COVID', submittedBy: 'Actuarial Analyst', status: 'Superseded', effectiveDate: '2025-01-01' },
  ]);

  const updateStatus = (id: string, status: AssumptionStatus) => {
    setAssumptions(assumptions.map(a => a.id === id ? { ...a, status } : a));
    const isApproved = status === 'Approved';
    toast(isApproved ? `Assumption ${id} Officially Signed Off` : `Assumption ${id} Returned to Draft`, {
      icon: isApproved ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />,
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '12px' }
    });
  };

  const pendingCount = assumptions.filter(a => a.status === 'Pending Approval').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Assumptions Register</h2>
          <p className="text-sm text-slate-500">Actuarial basis parameters — best-estimate assumptions for valuation, pricing, and projection models. Analysts propose; Chief Actuary approves.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Active Assumptions" value={assumptions.filter(a => a.status === 'Approved').length.toString()} trend="In production" trendDirection="up" icon={<BarChart3 className="w-5 h-5" />} />
        <MetricCard title="Pending Chief Sign-off" value={pendingCount.toString()} trend={isChief ? 'Requires your approval' : 'Awaiting Chief Actuary'} trendDirection={pendingCount > 0 ? 'down' : 'up'} icon={<Clock className="w-5 h-5" />} />
        <MetricCard title="Last Review Cycle" value="Q4 2025" trend="Annual experience investigation" trendDirection="neutral" icon={<Settings2 className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">Assumptions Governance Queue</h3>
          {!isChief && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-100 text-amber-700 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Approval: Chief Actuary Only
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-700">ID</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Category</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Parameter</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Current → Proposed</th>
                <th className="px-5 py-3 font-semibold text-slate-700">Rationale</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-center">Status</th>
                <th className="px-5 py-3 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assumptions.map(asm => (
                <tr key={asm.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono font-medium text-slate-900">
                    <div>{asm.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{asm.submittedBy}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                      asm.category === 'Mortality' ? 'bg-rose-50 text-rose-700' :
                      asm.category === 'Lapse' ? 'bg-amber-50 text-amber-700' :
                      asm.category === 'Expense' ? 'bg-sky-50 text-sky-700' :
                      asm.category === 'Discount' ? 'bg-indigo-50 text-indigo-700' : 'bg-purple-50 text-purple-700'
                    }`}>{asm.category}</span>
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-700">{asm.parameter}</td>
                  <td className="px-5 py-3 font-mono text-sm">
                    <span className="text-slate-400">{asm.currentValue}</span>
                    <span className="text-slate-400 mx-1">→</span>
                    <span className="text-indigo-700 font-semibold">{asm.proposedValue}</span>
                  </td>
                  <td className="px-5 py-3 text-xs max-w-[200px] truncate" title={asm.basis}>{asm.basis}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      asm.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      asm.status === 'Draft' ? 'bg-slate-100 text-slate-600' :
                      asm.status === 'Superseded' ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-700'
                    }`}>{asm.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {asm.status === 'Pending Approval' ? (
                      isChief ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateStatus(asm.id, 'Approved')} className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded text-xs font-semibold shadow-sm flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button onClick={() => updateStatus(asm.id, 'Draft')} className="text-rose-600 bg-rose-50 px-2 py-1.5 rounded text-xs flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Return
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] italic text-slate-400 flex items-center justify-end gap-1"><Lock className="w-3 h-3" /> Chief Only</span>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
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
