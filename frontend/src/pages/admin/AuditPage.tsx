import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FileSearch, 
  Filter, 
  Download, 
  Terminal, 
  ShieldCheck, 
  History,
  Lock,
  User,
  Activity,
  ArrowUpDown
} from 'lucide-react';
import { complianceApi } from '../../services/complianceApi';
import { SovereignVerifiedBadge } from '../../components/common/SovereignVerifiedBadge';

export const AuditPage: React.FC = () => {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['full-audit-logs'],
        queryFn: () => complianceApi.getAuditLogs(100),
        refetchInterval: 10000
    });

    if (isLoading) return <div className="p-8 animate-pulse text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Forensic Ledger...</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-700">
            <header className="flex justify-between items-end mb-8">
                <div>
                     <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Forensic Audit Ledger</h1>
                        <SovereignVerifiedBadge signature="LEDGER_SSOT_VERIFIED" />
                     </div>
                     <p className="text-slate-500 font-bold mt-1 uppercase tracking-[0.3em] text-[10px]">High-Fidelity Event Stream & Compliance Forensics</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
                        <Filter className="w-4 h-4" />
                        Apply Filter
                    </button>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20">
                        <Download className="w-4 h-4" />
                        Export Forensic CSV
                    </button>
                </div>
            </header>

            {/* Audit Stats Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-premium overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Type</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiator</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Node / Service</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs?.map((log: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-all group cursor-pointer">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <History className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                                            <span className="text-xs font-bold text-slate-600">{new Date(log.created_at).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight ${
                                            log.event_type === 'CREATE' ? 'bg-emerald-50 text-emerald-600' :
                                            log.event_type === 'DELETE' ? 'bg-rose-50 text-rose-600' :
                                            'bg-indigo-50 text-indigo-600'
                                        }`}>
                                            {log.event_type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                                <User className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <span className="text-xs font-black text-slate-900 tracking-tight">{log.user?.split('@')[0] || 'SYSTEM'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{log.module || 'CORE-SVC'}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-medium text-slate-600 max-w-sm truncate">{log.detail}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-emerald-600">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Forensic Pass</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination / Footer */}
            <div className="flex justify-between items-center px-8 py-6 bg-slate-900 rounded-[30px] text-white">
                <div className="flex items-center gap-3">
                     <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Real-time Stream Connectivity: STABLE</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/20 transition-all">Prev</button>
                    <button className="px-4 py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all">Next</button>
                </div>
            </div>
        </div>
    );
};
