import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import {
  ShieldAlert, Fingerprint, Lock, ShieldCheck, Activity,
  Calculator, LineChart, BrainCircuit, Microscope, FileCheck, Settings,
  Crown, Users, AlertTriangle, Scale, Mail, RefreshCw, Database
} from 'lucide-react';

import { API_BASE_URL } from '../../config/api';

const API_URL = API_BASE_URL;

// All 10 enterprise roles with proper demo tokens
const makeToken = (email: string, roles: string[]) =>
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ sub: email, roles, exp: Date.now() / 1000 + 86400 }))}.mock`;

interface DemoRole {
  key: string;
  label: string;
  email: string;
  roles: string[];
  icon: React.ReactNode;
  color: string;
  dept: string;
}

const demoRoles: DemoRole[] = [
  { key: 'admin', label: 'Administrator', email: 'admin@mfcalytix.com', roles: ['admin'], icon: <Settings className="w-4 h-4" />, color: 'from-violet-500 to-purple-600', dept: 'Platform' },
  { key: 'chief_accountant', label: 'Chief Accountant', email: 'chief.accountant@mfcalytix.com', roles: ['chief_accountant'], icon: <Crown className="w-4 h-4" />, color: 'from-emerald-500 to-teal-600', dept: 'Finance' },
  { key: 'junior_accountant', label: 'Junior Accountant', email: 'junior@mfcalytix.com', roles: ['junior_accountant'], icon: <Calculator className="w-4 h-4" />, color: 'from-emerald-400 to-green-500', dept: 'Finance' },
  { key: 'chief_actuary', label: 'Chief Actuary', email: 'chief.actuary@mfcalytix.com', roles: ['chief_actuary'], icon: <Crown className="w-4 h-4" />, color: 'from-sky-500 to-blue-600', dept: 'Actuarial' },
  { key: 'actuary', label: 'Actuary', email: 'actuary@mfcalytix.com', roles: ['actuary'], icon: <LineChart className="w-4 h-4" />, color: 'from-sky-400 to-cyan-500', dept: 'Actuarial' },
  { key: 'actuarial_analyst', label: 'Actuarial Analyst', email: 'analyst@mfcalytix.com', roles: ['actuarial_analyst'], icon: <Users className="w-4 h-4" />, color: 'from-cyan-400 to-sky-500', dept: 'Actuarial' },
  { key: 'cro', label: 'Chief Risk Officer', email: 'cro@mfcalytix.com', roles: ['cro'], icon: <AlertTriangle className="w-4 h-4" />, color: 'from-orange-500 to-red-500', dept: 'Risk' },
  { key: 'risk_analyst', label: 'Risk Analyst', email: 'risk@mfcalytix.com', roles: ['risk_analyst'], icon: <ShieldAlert className="w-4 h-4" />, color: 'from-amber-400 to-orange-500', dept: 'Risk' },
  { key: 'chief_compliance_officer', label: 'Chief Compliance', email: 'cco@mfcalytix.com', roles: ['chief_compliance_officer'], icon: <Scale className="w-4 h-4" />, color: 'from-amber-500 to-yellow-600', dept: 'Compliance' },
  { key: 'compliance_officer', label: 'Compliance Officer', email: 'compliance@mfcalytix.com', roles: ['compliance_officer'], icon: <FileCheck className="w-4 h-4" />, color: 'from-yellow-400 to-amber-500', dept: 'Compliance' },
  { key: 'data_scientist', label: 'Data Scientist', email: 'ds@mfcalytix.com', roles: ['data_scientist'], icon: <Microscope className="w-4 h-4" />, color: 'from-cyan-500 to-teal-500', dept: 'Data Science' },
];

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRedirectRoute = (roles: string[]) => {
    if (roles.includes('admin')) return '/autonomous-hub';
    if (roles.some(r => ['chief_accountant', 'junior_accountant'].includes(r))) return '/accounting';
    if (roles.some(r => ['chief_actuary', 'actuary', 'actuarial_analyst'].includes(r))) return '/actuarial';
    if (roles.some(r => ['cro', 'risk_analyst'].includes(r))) return '/risk';
    if (roles.some(r => ['chief_compliance_officer', 'compliance_officer'].includes(r))) return '/compliance';
    if (roles.includes('data_scientist')) return '/data-science';
    return '/dashboard';
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            navigate(getRedirectRoute(payload.roles || []));
        } catch {
            navigate('/dashboard');
        }
    }
  }, [navigate]);

  const loginAs = (role: DemoRole) => {
    const token = makeToken(role.email, role.roles);
    useAuthStore.getState().setTokens(token, token);
    navigate(getRedirectRoute(role.roles));
  };

  const authenticate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const emailLower = email.toLowerCase();
      // Keep demo matching logic for ease of use during transition/testing
      let matched = demoRoles.find(r => emailLower.includes(r.key)) || demoRoles.find(r => r.key === 'junior_accountant');

      if (emailLower.includes('admin')) matched = demoRoles[0];
      else if (emailLower.includes('chief_accountant')) matched = demoRoles[1];
      else if (emailLower.includes('cro')) matched = demoRoles[6];
      // ... more matching logic can be added if needed

      if (password.length > 0 && matched) {
        await new Promise(r => setTimeout(r, 600));
        loginAs(matched);
        return;
      }

      const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { access_token, refresh_token } = loginRes.data;
      useAuthStore.getState().setTokens(access_token, refresh_token);
      
      // Attempt to decode roles for redirection, fallback to dashboard
      try {
          const payload = JSON.parse(atob(access_token.split('.')[1]));
          navigate(getRedirectRoute(payload.roles || []));
      } catch {
          navigate('/dashboard');
      }
    } catch (err: any) {
      setMessage("Authentication failed. Verify your enterprise credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#020617] overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col text-white space-y-8 animate-fade-in">
          <div className="space-y-4">
            <img src="/logo.jpg" alt="MFC-Alytix" className="h-24 w-auto object-contain mb-8 drop-shadow-2xl" />
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white font-display">
              Financial Intelligence <br/>
              <span className="text-sky-400">Platform</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md font-medium leading-relaxed">
              Unified analytical engine for Insurance, Risk & Actuarial Systems, and Advanced Data Science.
            </p>
          </div>

          <div className="space-y-5">
            {[
              { icon: <ShieldCheck className="w-5 h-5" />, text: "Bank-grade Security Protocols" },
              { icon: <Activity className="w-5 h-5" />, text: "Real-time Risk Telemetry" },
              { icon: <BrainCircuit className="w-5 h-5" />, text: "AI-driven Compliance Reasoning" },
              { icon: <Database className="w-5 h-5" />, text: "Advanced Forensic Data Science" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-300 group">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-sky-500/50 group-hover:text-sky-400 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold tracking-wide">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Glassmorphic Login Card */}
        <div className="w-full max-w-[440px] mx-auto animate-slide-up">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] rounded-[32px] p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
            
            <form onSubmit={(e) => { e.preventDefault(); authenticate(); }} className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Secure Access</h2>
                <p className="text-sm text-slate-400 font-medium">Enterprise Single Sign-On</p>
              </div>

              <div className="space-y-4">
                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    type="text" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all font-medium text-sm"
                    placeholder="Enterprise Email"
                  />
                </div>

                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-sky-400 transition-colors" />
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all font-medium text-sm"
                    placeholder="Password / API Key"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <Link to="/forgot-password" className="text-xs font-bold text-slate-500 hover:text-sky-400 transition-colors">Forgot password?</Link>
                  <Link to="/register" className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors">Onboard New Node</Link>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_10px_20px_-5px_rgba(59,130,246,0.3)] hover:shadow-sky-500/40 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Secure Login</>
                  )}
                </button>

                {message && (
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mt-4 justify-center bg-rose-500/10 py-3 px-4 rounded-2xl border border-rose-500/20">
                    <ShieldAlert className="w-4 h-4 shrink-0" /> {message}
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-slate-500">
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> SOC2 COMPLIANT</div>
                <div className="flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5" /> ENCRYPTED</div>
                <div className="flex items-center gap-1.5"><Microscope className="w-3.5 h-3.5" /> SECURE CLOUD</div>
              </div>
            </form>
          </div>
          
          <div className="mt-8 text-center animate-fade-in delay-700">
             <a 
               href="https://www.linkedin.com/in/mathew-mabira-24861632b" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-[10px] font-bold text-slate-400 hover:text-sky-400 group"
             >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span>PLATFORM ARCHITECT:</span>
                <span className="text-white group-hover:text-sky-400 underline decoration-sky-500/30 underline-offset-4">MATHEW MABIRA</span>
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};
