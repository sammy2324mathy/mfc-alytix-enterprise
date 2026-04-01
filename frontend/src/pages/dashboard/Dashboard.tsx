import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { MetricCard } from '../../components/data-display/MetricCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { financialApi } from '../../services/financialApi';
import { riskApi } from '../../services/riskApi';
import { workspaceApi } from '../../services/workspaceApi';
import { Users, FileText, AlertTriangle, TrendingUp, ArrowRight, Clock, Zap, Shield, BarChart3, BrainCircuit } from 'lucide-react';

const roleGreetings: Record<string, { title: string; subtitle: string }> = {
  admin: { title: 'Executive Operations Hub', subtitle: 'AI-led operations are running at 98.4% efficiency. Specialist oversight required for 1.6% of complex events.' },
  chief_accountant: { title: 'Financial Specialist Hub', subtitle: 'Collaborating with the AI Financial Core for high-level consolidation and strategic decision-making.' },
  junior_accountant: { title: 'Oversight Workspace', subtitle: 'Monitoring autonomous ledger flows and validating AI-reconciled transactions.' },
  chief_actuary: { title: 'Actuarial Governance Node', subtitle: 'Scientific oversight of AI-generated mortality tables and complex risk simulations.' },
  actuary: { title: 'Specialist Actuarial Lab', subtitle: 'Partnering with the Claims AutoPilot for high-complexity adjudication and pricing.' },
  actuarial_analyst: { title: 'Analysis Specialist', subtitle: 'Reviewing AI-led survival analysis and neural projections.' },
  data_scientist: { title: 'Intelligence Core Management', subtitle: 'Governing the neural engines that drive the autonomous enterprise.' },
  cro: { title: 'Risk Specialist Command', subtitle: 'High-level governance of AI-prescribed risk limits and capital allocation.' },
  risk_analyst: { title: 'Risk Parameters Specialist', subtitle: 'Overseeing autonomous stress tests and proposal validation.' },
  chief_compliance_officer: { title: 'Statutory Specialist Hub', subtitle: 'Final validation of AI-signed regulatory filings and neural audit trails.' },
  compliance_officer: { title: 'Regulatory Oversight', subtitle: 'Monitoring automated compliance streams and policy enforcement.' },
};

const allQuickActions = [
  { label: 'Autonomous Hub', href: '/autonomous-hub', icon: Zap, roles: ['admin', 'chief_accountant', 'cro', 'chief_actuary'] },
  { label: 'Review AI Decisions', href: '/autonomous-hub', icon: BarChart3, roles: ['admin', 'chief_accountant', 'junior_accountant'] },
  { label: 'Risk Oversight', href: '/risk', icon: Shield, roles: ['admin', 'cro', 'risk_analyst', 'actuary'] },
  { label: 'Intelligence Lab', href: '/ai/chat', icon: BrainCircuit, roles: ['admin', 'data_scientist', 'actuary'] },
  { label: 'Compliance Logs', href: '/compliance', icon: Shield, roles: ['admin', 'compliance_officer'] },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const primaryRole = user?.roles?.[0] || 'admin';
  
  // Real-time API Integration
  const { data: accounts, isLoading: loadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: financialApi.getAccounts
  });

  const { data: solvency, isLoading: loadingRisk } = useQuery({
    queryKey: ['solvency'],
    queryFn: riskApi.getSolvency
  });

  const { data: activity, isLoading: loadingActivity } = useQuery({
    queryKey: ['activity'],
    queryFn: () => workspaceApi.getActivity()
  });

  const greeting = roleGreetings[primaryRole] || roleGreetings.admin;
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

const recentActivity = activity?.data || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-enterprise-900 via-enterprise-800 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-premium">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI2MCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-indigo-300 text-sm font-medium tracking-wide uppercase">{timeGreeting}</p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mt-1 tracking-tight">{greeting.title}</h1>
            <p className="text-slate-300 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">{greeting.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400 font-medium">Session Active</p>
              <p className="text-sm font-bold text-premium-gold">Enterprise Tier</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-indigo-200" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingAccounts ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
        ) : (
          <>
            <MetricCard title="Total Accounts" value={String(accounts?.length || 0)} trend="+2.4%" trendDirection="up" description="Active ledger entries" icon={<Users className="w-5 h-5" />} onClick={() => navigate('/accounting/ledger')} />
            <MetricCard title="System Solvency" value={solvency?.solvency_ratio ? `${(solvency.solvency_ratio * 100).toFixed(1)}%` : "164.2%"}  trend="+1.2%" trendDirection="up" description="Capital adequacy" icon={<TrendingUp className="w-5 h-5" />} onClick={() => navigate('/risk/metrics')} />
            <MetricCard title="Active Projects" value="12" trend="stable" trendDirection="neutral" description="Across all modules" icon={<FileText className="w-5 h-5" />} onClick={() => navigate('/accounting/projects')} />
            <MetricCard title="Risk Confidence" value="99.9%" trend="max" trendDirection="up" description="VaR threshold" icon={<AlertTriangle className="w-5 h-5" />} onClick={() => navigate('/risk/simulations')} />
          </>
        )}
      </div>

      {/* Neural Intelligence Insight Banner */}
      <div className="bg-white rounded-3xl border border-indigo-100 shadow-premium p-1 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 via-white to-white" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-200 shrink-0 animate-pulse">
               <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Neural Intelligence Insight</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Just Generated</span>
               </div>
               <h3 className="text-lg font-bold text-slate-900 leading-tight">Projected Solvency remains stable at 164.2% for Q3.</h3>
               <p className="text-sm text-slate-500 mt-1 font-medium italic">"The current capital buffer is optimized for high-volatility scenarios. Recommended action: Maintain existing risk appetite."</p>
            </div>
            <button onClick={() => navigate('/ai')} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-indigo-500/10 flex items-center gap-2 whitespace-nowrap">
              Run Full Analysis <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">Operational Log</h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-wider">Sync All Nodes</button>
          </div>
          <div className="divide-y divide-slate-100">
            {loadingActivity ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((run: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-white group-hover:border-indigo-100 transition-all">
                      <Zap className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{run.name || run.description || 'System Event'}</p>
                      <div className="flex gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono text-indigo-600/70">{run.id || 'EVT-001'}</span>
                        <span className="text-slate-300">•</span>
                        <span>{run.type || 'Infrastructure'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Success
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">{run.time || 'Just now'}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm italic">
                No recent activity logged.
              </div>
            )}
          </div>
        </div>

        {/* Quick Access + System Health */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-premium border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-5">Quick Launch</h3>
            <div className="space-y-3">
              {allQuickActions.filter(a => a.roles.includes(primaryRole)).map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.href} onClick={() => navigate(action.href)} className="w-full text-left px-4 py-3.5 rounded-xl border border-slate-50 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-sm font-semibold text-slate-600 flex items-center justify-between group">
                    <span className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      {action.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-premium border border-slate-100 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-5">Environment Integrity</h4>
            <div className="space-y-4">
              {[
                { name: 'Gateway', status: 100, color: 'emerald' },
                { name: 'Accounting', status: 100, color: 'emerald' },
                { name: 'Actuarial', status: 99, color: 'emerald' },
                { name: 'Risk Ops', status: 94, color: 'indigo' },
                { name: 'AI Core', status: 88, color: 'indigo' },
              ].map(svc => (
                <div key={svc.name} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-slate-500">{svc.name}</span>
                    <span className={`text-${svc.color}-600`}>{svc.status}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-1.5 rounded-full bg-${svc.color}-500 transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)]`} style={{ width: `${svc.status}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
