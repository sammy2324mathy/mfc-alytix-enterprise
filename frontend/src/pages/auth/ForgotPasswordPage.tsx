import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  Fingerprint, 
  ShieldAlert,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await new Promise(r => setTimeout(r, 1000));
      // In a real app, we'd call the API here
      // await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setIsSent(true);
    } catch (err: any) {
      setMessage("Recovery initiation failed. Identity not found in local registries.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#020617] overflow-hidden">
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full filter blur-[120px] animate-blob"></div>

      <div className="relative z-10 w-full max-w-[440px] animate-slide-up">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] rounded-[32px] p-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
          
          <div className="text-center mb-10 space-y-2">
             <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                   <Search className="w-8 h-8 text-sky-400" />
                </div>
             </div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Identity Recovery</h2>
             <p className="text-sm text-slate-400 font-medium italic">Initiating Neural Re-authentication Protocol</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleRequest} className="space-y-6">
              <div className="group relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                <input
                  type="email" required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all font-medium text-sm"
                  placeholder="Enterprise Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)] hover:shadow-sky-500/40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>Locate Identity <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              {message && (
                <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase mt-4 justify-center bg-rose-500/10 py-3 px-4 rounded-2xl border border-rose-500/20">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {message}
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[24px] text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                     <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Protocol Initiated</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    A secure recovery packet has been dispatched to <span className="text-emerald-400 font-bold">{email}</span>. 
                    Please follow the encrypted link to re-calibrate your credentials.
                  </p>
               </div>
               <button 
                  onClick={() => setIsSent(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
               >
                  Resend Recovery Packet
               </button>
            </div>
          )}

          <div className="pt-8 mt-8 border-t border-white/5 text-center">
             <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-sky-400 transition-colors">
               Return to Secure Hub
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
