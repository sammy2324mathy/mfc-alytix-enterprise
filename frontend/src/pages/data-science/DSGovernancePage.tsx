import React from 'react';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Scale, Shield, FileText, CheckCircle } from 'lucide-react';

const controls = [
  { id: 'GOV-01', area: 'Data Privacy', control: 'POPIA/GDPR consent management', compliance: 'Compliant', lastAudit: 'Oct 2025' },
  { id: 'GOV-02', area: 'Model Ethics', control: 'Bias testing on all scoring models', compliance: 'Compliant', lastAudit: 'Sep 2025' },
  { id: 'GOV-03', area: 'Data Retention', control: 'Automated 7-year retention policy', compliance: 'Compliant', lastAudit: 'Nov 2025' },
  { id: 'GOV-04', area: 'Access Control', control: 'Role-based data access and audit logging', compliance: 'Compliant', lastAudit: 'Oct 2025' },
  { id: 'GOV-05', area: 'Model Documentation', control: 'Model cards for all production models', compliance: 'Partial', lastAudit: 'Nov 2025' },
  { id: 'GOV-06', area: 'Regulatory Reporting', control: 'Automated regulatory data extracts', compliance: 'Compliant', lastAudit: 'Oct 2025' },
];

export const DSGovernancePage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-slate-900">Data Governance & Compliance</h2>
      <p className="text-sm text-slate-500">Privacy, ethics, regulatory compliance, model documentation, and data security governance framework.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Governance Controls" value="6" trend="Active" trendDirection="neutral" icon={<Scale className="w-5 h-5" />} />
      <MetricCard title="Fully Compliant" value="5" trend="83% coverage" trendDirection="up" icon={<Shield className="w-5 h-5" />} />
      <MetricCard title="Model Cards" value="12/14" trend="2 pending" trendDirection="neutral" icon={<FileText className="w-5 h-5" />} />
      <MetricCard title="Last Audit" value="Nov 2025" trend="Clean finding" trendDirection="up" icon={<CheckCircle className="w-5 h-5" />} />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50"><h3 className="font-semibold text-slate-800">Governance Control Register</h3></div>
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b">
          <tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Area</th><th className="px-5 py-3">Control</th><th className="px-5 py-3 text-center">Compliance</th><th className="px-5 py-3">Last Audit</th></tr>
        </thead>
        <tbody>
          {controls.map(c => (
            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-3 font-mono font-medium text-slate-900">{c.id}</td>
              <td className="px-5 py-3 font-medium text-slate-700">{c.area}</td>
              <td className="px-5 py-3 text-sm">{c.control}</td>
              <td className="px-5 py-3 text-center"><span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.compliance === 'Compliant' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{c.compliance}</span></td>
              <td className="px-5 py-3 text-xs">{c.lastAudit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
