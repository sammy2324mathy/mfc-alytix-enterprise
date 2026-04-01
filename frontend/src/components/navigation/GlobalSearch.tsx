import React, { useState, useEffect } from 'react';
import { Search, X, FileText, Activity, ShieldCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

export const GlobalSearch: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        try {
          const res = await apiClient.get(`/compliance/telemetry/data/search?query=${query}`);
          setResults(res.data);
        } catch (error) {
          console.error('Search failed', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <Search className="w-6 h-6 text-indigo-600" />
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-900 placeholder:text-slate-300"
            placeholder="Search the Sovereign Enterprise..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          />
          <div className="p-1 px-2.5 rounded-lg bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">ESC</div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
          {isLoading ? (
             <div className="p-10 text-center text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Neural Search in Progress...</div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <button 
                key={item.id}
                className="w-full p-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-between group border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.service === 'Accounting' ? 'bg-emerald-50 text-emerald-600' :
                    item.service === 'Actuarial' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {item.type === 'Claim' ? <Activity className="w-5 h-5" /> : 
                     item.type === 'Journal' ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.service} • {item.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Jump to</span>
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))
          ) : query.length > 2 ? (
            <div className="p-10 text-center text-slate-400 italic">No nodes found matching your query.</div>
          ) : (
            <div className="p-10 space-y-6">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">Global Entity Registry</p>
               <div className="grid grid-cols-2 gap-4">
                  {['Claims', 'Journals', 'Assessments', 'Policies', 'Risks', 'Valuations'].map(t => (
                    <div key={t} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                       <span className="text-xs font-bold text-slate-600">{t}</span>
                       <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all" />
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center px-8">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Orchestrator Active</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">34,092 Nodes Scanned</span>
              </div>
           </div>
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Sovereign Data Engine v1.0</p>
        </div>
      </div>
    </div>
  );
};
