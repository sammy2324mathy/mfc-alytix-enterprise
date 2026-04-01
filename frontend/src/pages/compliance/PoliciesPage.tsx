import React from 'react';
import { BookOpen, CheckCircle, Clock, ExternalLink } from 'lucide-react';

const policies = [
  { id: 'POL-001', name: 'Anti-Money Laundering (AML)', version: '3.2', lastReviewed: 'Sep 2025', nextReview: 'Sep 2026', owner: 'CCO', status: 'Active' },
  { id: 'POL-002', name: 'Know Your Customer (KYC)', version: '2.8', lastReviewed: 'Jul 2025', nextReview: 'Jul 2026', owner: 'CCO', status: 'Active' },
  { id: 'POL-003', name: 'Data Protection (POPIA/GDPR)', version: '4.0', lastReviewed: 'Oct 2025', nextReview: 'Oct 2026', owner: 'DPO', status: 'Active' },
  { id: 'POL-004', name: 'Conflict of Interest', version: '1.5', lastReviewed: 'Mar 2025', nextReview: 'Mar 2026', owner: 'CCO', status: 'Under Review' },
  { id: 'POL-005', name: 'Outsourcing & Third-Party Risk', version: '2.1', lastReviewed: 'Jun 2025', nextReview: 'Jun 2026', owner: 'CRO', status: 'Active' },
  { id: 'POL-006', name: 'Whistleblower Protection', version: '1.3', lastReviewed: 'Jan 2025', nextReview: 'Jan 2026', owner: 'HR/Legal', status: 'Active' },
];

export const PoliciesPage: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-slate-900">Policy Register</h2>
      <p className="text-sm text-slate-500">Internal compliance policies, versioning, ownership, and review cycle tracking.</p>
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-sm text-left text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3 font-semibold text-slate-700">ID</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Policy Name</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Version</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Owner</th>
            <th className="px-5 py-3 font-semibold text-slate-700">Next Review</th>
            <th className="px-5 py-3 font-semibold text-slate-700 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(p => (
            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-5 py-3 font-mono font-medium text-slate-900">{p.id}</td>
              <td className="px-5 py-3 font-medium text-slate-700 flex items-center gap-2">{p.name} <ExternalLink className="w-3 h-3 text-slate-400" /></td>
              <td className="px-5 py-3 text-center font-mono text-xs">v{p.version}</td>
              <td className="px-5 py-3 text-xs">{p.owner}</td>
              <td className="px-5 py-3 text-xs flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {p.nextReview}</td>
              <td className="px-5 py-3 text-center">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
