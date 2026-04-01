import { useMutation } from '@tanstack/react-query';
import { ClipboardCheck, Search, Filter, Download, Loader2 } from 'lucide-react';
import { complianceApi } from '../../services/complianceApi';

const auditEvents = [
  { id: 'CA-091', time: '2025-11-04 14:32', actor: 'compliance@mfcalytix.com', event: 'Submitted ORSA-2025 filing for CCO review', evidence: 'Filing attached', status: 'Complete' },
  { id: 'CA-090', time: '2025-11-03 16:20', actor: 'chief_compliance@mfcalytix.com', event: 'Signed and filed Q3 NAIC Statutory Return to regulator', evidence: 'Digital signature', status: 'Complete' },
  { id: 'CA-089', time: '2025-11-02 09:15', actor: 'compliance@mfcalytix.com', event: 'Updated AML policy to v3.2 — new beneficial ownership requirements', evidence: 'Change log', status: 'Complete' },
  { id: 'CA-088', time: '2025-10-30 11:45', actor: 'chief_compliance@mfcalytix.com', event: 'Returned SAM QRT filing — data quality issue in template S.02', evidence: 'Review notes', status: 'Revision' },
  { id: 'CA-087', time: '2025-10-28 14:00', actor: 'compliance@mfcalytix.com', event: 'Completed annual POPIA impact assessment for new credit product', evidence: 'Assessment report', status: 'Complete' },
];

export const ComplianceAuditPage: React.FC = () => {
  const { mutate: handleExport, isPending: isExporting } = useMutation({
    mutationFn: () => complianceApi.exportFilings('csv')
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Compliance Audit Trail</h2>
          <p className="text-sm text-slate-500">Immutable log of all compliance actions, filings, and evidence for regulatory auditors.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleExport()}
            disabled={isExporting}
            className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export Audit Trial
          </button>
          <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 flex items-center gap-2"><Filter className="w-4 h-4" /> Filter</button>
          <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 flex items-center gap-2"><Search className="w-4 h-4" /> Search</button>
        </div>
      </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 font-semibold text-slate-700">Audit ID</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Timestamp</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Actor</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Event</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Evidence</th>
          </tr>
        </thead>
        <tbody>
          {auditEvents.map(e => (
            <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-3 font-mono font-medium text-slate-900">{e.id}</td>
              <td className="px-5 py-3 font-mono text-xs text-slate-500">{e.time}</td>
              <td className="px-5 py-3 text-xs font-medium">{e.actor}</td>
              <td className="px-5 py-3 text-sm">{e.event}</td>
              <td className="px-5 py-3 text-center">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 flex items-center gap-1 w-fit mx-auto"><ClipboardCheck className="w-3 h-3" /> {e.evidence}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};
