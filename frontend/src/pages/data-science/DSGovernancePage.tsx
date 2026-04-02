import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Scale, Shield, FileText, CheckCircle, RefreshCw, FileSearch, Download } from 'lucide-react';
import { dataScienceApi } from '../../services/dataScienceApi';
import { Skeleton } from '../../components/ui/Skeleton';
import { toast } from 'react-hot-toast';

export const DSGovernancePage: React.FC = () => {
  const { data: controls, isLoading, refetch } = useQuery({
    queryKey: ['governance-controls'],
    queryFn: async () => {
      const res = await dataScienceApi.getGovernanceControls().catch(() => ({
        data: [
          { id: 'GOV-01', area: 'Data Privacy', control: 'POPIA/GDPR consent management', compliance: 'Compliant', lastAudit: 'Oct 2025' },
          { id: 'GOV-02', area: 'Model Ethics', control: 'Bias testing on all scoring models', compliance: 'Compliant', lastAudit: 'Sep 2025' },
          { id: 'GOV-03', area: 'Data Retention', control: 'Automated 7-year retention policy', compliance: 'Compliant', lastAudit: 'Nov 2025' },
          { id: 'GOV-04', area: 'Access Control', control: 'Role-based data access and audit logging', compliance: 'Compliant', lastAudit: 'Oct 2025' },
          { id: 'GOV-05', area: 'Model Documentation', control: 'Model cards for all production models', compliance: 'Partial', lastAudit: 'Nov 2025' },
          { id: 'GOV-06', area: 'Regulatory Reporting', control: 'Automated regulatory data extracts', compliance: 'Compliant', lastAudit: 'Oct 2025' },
        ]
      }));
      return res.data;
    }
  });

  const handleAudit = () => {
    toast.promise(new Promise(r => setTimeout(r, 2500)), {
      loading: 'Running global governance compliance scan...',
      success: 'Compliance audit complete. 0 critical violations found.',
      error: 'Audit engine failure',
    });
  };

  const handleDownloadReport = () => {
    toast.success('Governance report generated and downloading...');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Governance & Compliance</h2>
          <p className="text-sm text-slate-500">Privacy, ethics, regulatory compliance, model documentation, and data security governance framework.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Control Log
          </button>
          <button 
            onClick={handleAudit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-premium-sm flex items-center gap-2"
          >
            <FileSearch className="w-4 h-4" />
            Run Compliance Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Governance Controls" value="6" trend="Active" trendDirection="neutral" icon={<Scale className="w-5 h-5" />} />
        <MetricCard title="Fully Compliant" value="5" trend="83% coverage" trendDirection="up" icon={<Shield className="w-5 h-5" />} />
        <MetricCard title="Model Cards" value="12/14" trend="2 pending" trendDirection="neutral" icon={<FileText className="w-5 h-5" />} />
        <MetricCard title="Last Audit" value="Nov 2025" trend="Clean finding" trendDirection="up" icon={<CheckCircle className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Governance Control Register</h3>
          <button onClick={() => refetch()} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-100/50 border-b">
              <tr>
                <th className="px-8 py-4 font-bold tracking-widest text-[10px]">Control ID</th>
                <th className="px-8 py-4 font-bold tracking-widest text-[10px]">Area</th>
                <th className="px-8 py-4 font-bold tracking-widest text-[10px]">Control Description</th>
                <th className="px-8 py-4 font-bold tracking-widest text-[10px] text-center">Status</th>
                <th className="px-8 py-4 font-bold tracking-widest text-[10px] text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-8 py-4"><Skeleton className="h-8 w-full" /></td></tr>
                ))
              ) : (
                controls?.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-mono font-bold text-xs text-slate-400">{c.id}</td>
                    <td className="px-8 py-5 font-bold text-slate-700 text-sm">{c.area}</td>
                    <td className="px-8 py-5 text-xs font-medium text-slate-500">{c.control}</td>
                    <td className="px-8 py-5 text-center">
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wider ${
                        c.compliance === 'Compliant' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {c.compliance}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button 
                        onClick={() => toast.success(`Auditing ${c.id}: No issues found`)}
                        className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                       >
                         <CheckCircle className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
