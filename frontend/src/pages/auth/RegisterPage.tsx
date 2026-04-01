import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Fingerprint, 
  ShieldAlert,
  RefreshCw,
  Building2,
  ChevronDown
} from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { API_BASE_URL } from '../../config/api';

const deptRoles = [
  { dept: 'Finance', roles: ['junior_accountant', 'chief_accountant'], color: 'from-emerald-500 to-teal-600' },
  { dept: 'Actuarial', roles: ['actuarial_analyst', 'actuary', 'chief_actuary'], color: 'from-sky-500 to-blue-600' },
  { dept: 'Risk', roles: ['risk_analyst', 'cro'], color: 'from-orange-500 to-red-600' },
  { dept: 'Compliance', roles: ['compliance_officer', 'chief_compliance_officer'], color: 'from-amber-500 to-yellow-600' },
  { dept: 'Data Science', roles: ['data_scientist'], color: 'from-cyan-500 to-teal-500' },
];

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'junior_accountant'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Small artificial delay for premium feel
      await new Promise(r => setTimeout(r, 800));
      
      const res = await axios.post(`${API_BASE_URL}/auth/register`, formData);
      const { access_token, refresh_token } = res.data;
      useAuthStore.getState().setTokens(access_token, refresh_token);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setMessage("Identity collision detected. This email is already registered.");
      } else {
        setMessage("Registration failed. Verify enterprise connectivity.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#020617] overflow-hidden">
      {/* Background patterns same as Login */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`, backgroundSize: '40px 40px' }}>
      </div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-600/10 rounded-full filter blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full filter blur-[120px] animate-blob"></div>

      <div className="relative z-10 w-full max-w-[500px] animate-slide-up">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] rounded-[32px] p-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
          
          <div className="text-center mb-10 space-y-2">
             <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                   <Fingerprint className="w-8 h-8 text-sky-400" />
                </div>
             </div>
             <h2 className="text-2xl font-bold text-white tracking-tight">Onboard Controller</h2>
             <p className="text-sm text-slate-400 font-medium italic">Establishing Neural Identity for the Sovereign Enterprise</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
               {/* Full Name */}
               <div className="group relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    type="text" required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all font-medium text-sm"
                    placeholder="Full Professional Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
               </div>

               {/* Email */}
               <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    type="email" required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all font-medium text-sm"
                    placeholder="Enterprise Identity (Email)"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
               </div>

               {/* Role Selection */}
               <div className="group relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors pointer-events-none" />
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-10 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all font-medium text-sm appearance-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    {deptRoles.map(dept => (
                      <optgroup key={dept.dept} label={dept.dept} className="bg-[#020617] text-white">
                        {dept.roles.map(role => (
                          <option key={role} value={role}>{role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors pointer-events-none" />
               </div>

               {/* Password */}
               <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    type="password" required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all font-medium text-sm"
                    placeholder="Security Credential"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
               </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)] hover:shadow-sky-500/40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>Establish Identity <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            {message && (
              <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest mt-4 justify-center bg-rose-500/10 py-3 px-4 rounded-2xl border border-rose-500/20">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> {message}
              </div>
            )}

            <div className="pt-6 border-t border-white/5 text-center">
               <p className="text-xs text-slate-400 font-medium">
                 Already have a baseline identity? {' '}
                 <Link to="/login" className="text-sky-400 font-bold hover:text-sky-300 transition-colors underline-offset-4 hover:underline">
                   Secure Login
                 </Link>
               </p>
            </div>

            <div className="flex items-center justify-center gap-6 text-[9px] uppercase tracking-widest font-black text-slate-500 pt-2">
                 <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Identity Locked</div>
                 <div className="flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5" /> Encrypted</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
