import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  ShieldAlert,
  LineChart,
  BrainCircuit,
  FileCheck,
  Settings,
  LogOut,
  Sparkles,
  Microscope,
  ChevronRight,
  ChevronDown,
  Package,
  ShoppingCart,
  Building,
  Users,
  BarChart3,
  BookOpen,
  Receipt,
  CreditCard,
  Landmark,
  PieChart,
  FileText,
  Factory,
  Truck,
  ClipboardList,
  Wallet,
  UserCog,
  FolderKanban,
  Wrench,
  TrendingUp, 
  ArrowRight, 
  Clock, 
  Zap, 
  Shield, 
  ShieldCheck, 
  Fingerprint,
  Sliders,
  Activity,
  Lock,
  Settings2,
  List,
  Database,
  Banknote,
  Gavel,
  Rocket,
  Search,
  Scale,
  FlaskConical,
  FileSpreadsheet,
  Cpu,
  History
} from 'lucide-react';

import { useAuthStore } from '../../store/authStore';

/* ─── Types ─── */
interface NavChild {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  roles: string[];
}

interface NavGroup {
  section: string;
  roles: string[];
  items: (NavChild | NavParent)[];
}

interface NavParent {
  name: string;
  icon: React.FC<{ className?: string }>;
  roles: string[];
  basePath: string;
  children: NavChild[];
}

function isNavParent(item: NavChild | NavParent): item is NavParent {
  return 'children' in item;
}

/* ─── All roles shorthand ─── */
const EVERYONE: string[] = [];
const FINANCE = ['junior_accountant', 'chief_accountant'];
const FINANCE_SENIOR = ['chief_accountant'];
const RISK = ['risk_analyst', 'cro', 'actuary', 'actuarial_analyst', 'chief_actuary'];
const ACTUARIAL = ['actuary', 'actuarial_analyst', 'chief_actuary'];
const COMPLIANCE = ['compliance_officer', 'chief_compliance_officer'];
const DATA_SCI = ['data_scientist'];
const ADMIN_ONLY = ['admin'];
const ALL_ROLES = [...FINANCE, ...RISK, ...ACTUARIAL, ...COMPLIANCE, ...DATA_SCI];

/* ─── Grouped navigation structure ─── */
const sidebarSections: NavGroup[] = [
  {
    section: 'Autonomous Governance',
    roles: [ ...ALL_ROLES, ...ADMIN_ONLY ],
    items: [
      { name: 'Executive Hub', href: '/autonomous-hub', icon: Zap, roles: [ 'admin', 'chief_accountant', 'chief_actuary', 'cro' ] },
      { name: 'Oversight Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: EVERYONE },
    ],
  },
  {
    section: 'Financial Operations',
    roles: FINANCE,
    items: [
      { name: 'General Ledger', href: '/accounting/ledger', icon: Calculator, roles: FINANCE },
      { name: 'Accounts Payable', href: '/accounting/ap', icon: Receipt, roles: FINANCE },
      { name: 'Treasury & Cash', href: '/accounting/treasury', icon: Wallet, roles: FINANCE },
      { name: 'Asset Management', href: '/accounting/fixed-assets', icon: Landmark, roles: FINANCE },
      { name: 'Financial Reporting', href: '/accounting/reporting', icon: BarChart3, roles: FINANCE },
    ],
  },
  {
    section: 'Actuarial Intelligence',
    roles: ACTUARIAL,
    items: [
      { name: 'Modeling Workspace', href: '/actuarial/workspace', icon: Cpu, roles: ACTUARIAL },
      { name: 'Simulations Lab', href: '/actuarial/simulations', icon: FlaskConical, roles: ACTUARIAL },
      { name: 'Experience Studies', href: '/actuarial/investigation', icon: Activity, roles: ACTUARIAL },
      { name: 'Pricing Engine', href: '/actuarial/pricing', icon: Calculator, roles: ACTUARIAL },
      { name: 'ALM & Capital Hub', href: '/actuarial/alm', icon: PieChart, roles: ACTUARIAL },
      { name: 'Stress & Reserving', href: '/actuarial/stress-testing', icon: History, roles: ACTUARIAL },
      { name: 'Audit & Regulatory', href: '/actuarial/regulatory', icon: Scale, roles: ACTUARIAL },
      { name: 'Basis & Assumptions', href: '/actuarial/assumptions', icon: ClipboardList, roles: ACTUARIAL },
      { name: 'Tactical Dashboards', href: '/actuarial', icon: BarChart3, roles: ACTUARIAL },
    ],
  },

  {
    section: 'Risk & Capital Management',
    roles: RISK,
    items: [
      { name: 'Risk Command Center', href: '/risk/dashboard', icon: Shield, roles: RISK },
      { name: 'Solvency Telemetry', href: '/risk/solvency', icon: LineChart, roles: RISK },
      { name: 'Economic Capital', href: '/risk/capital', icon: Landmark, roles: RISK },
      { name: 'Underwriting Risk', href: '/risk/underwriting', icon: FileCheck, roles: RISK },
    ],
  },
  {
    section: 'Governance & Compliance',
    roles: COMPLIANCE,
    items: [
      { name: 'Compliance Registry', href: '/compliance/registry', icon: Gavel, roles: COMPLIANCE },
      { name: 'Policy Framework', href: '/compliance/policies', icon: BookOpen, roles: COMPLIANCE },
      { name: 'Audit & Remediation', href: '/compliance/audit', icon: Search, roles: COMPLIANCE },
      { name: 'Regulatory Deck', href: '/compliance/reporting', icon: FileSpreadsheet, roles: COMPLIANCE },
    ],
  },
  {
    section: 'ADVANCED DATA SCIENCE',
    roles: DATA_SCI,
    items: [
      { 
        name: 'Data Management', 
        icon: Database, 
        roles: DATA_SCI,
        basePath: '/data-science/data',
        children: [
          { name: 'Active Datasets', href: '/data-science/datasets', icon: Database, roles: DATA_SCI },
          { name: 'ETL Pipelines', href: '/data-science/data', icon: Activity, roles: DATA_SCI },
        ]
      },
      { 
        name: 'Analytics & Modeling', 
        icon: BrainCircuit, 
        roles: DATA_SCI,
        basePath: '/data-science/analytics',
        children: [
          { name: 'Risk Intelligence', href: '/data-science/risk', icon: Shield, roles: DATA_SCI },
          { name: 'Pricing Optimizer', href: '/data-science/pricing', icon: Banknote, roles: DATA_SCI },
          { name: 'Fraud Engine', href: '/data-science/fraud', icon: Search, roles: DATA_SCI },
          { name: 'Predictive Analytics', href: '/data-science/predictions', icon: TrendingUp, roles: DATA_SCI },
          { name: 'Experiment Lab', href: '/data-science/experiments', icon: Microscope, roles: DATA_SCI },
        ]
      },
      { 
        name: 'MLOps & Governance', 
        icon: Rocket, 
        roles: DATA_SCI,
        basePath: '/data-science/ops',
        children: [
          { name: 'Model Registry', href: '/data-science/models', icon: Package, roles: DATA_SCI },
          { name: 'Deployment Status', href: '/data-science/deployment', icon: Rocket, roles: DATA_SCI },
          { name: 'Governance Hub', href: '/data-science/governance', icon: Gavel, roles: DATA_SCI },
        ]
      },
    ],
  },
];

const roleLabelMap: Record<string, string> = {
  admin: 'System Administrator',
  chief_accountant: 'Chief Accountant',
  junior_accountant: 'Junior Accountant',
  chief_actuary: 'Chief Actuary',
  actuarial_analyst: 'Actuarial Analyst',
  data_scientist: 'Lead Data Scientist',
  cro: 'Chief Risk Officer',
  risk_analyst: 'Risk Analyst',
  chief_compliance_officer: 'Chief Compliance Officer',
  compliance_officer: 'Compliance Officer',
};

/* ─── Component ─── */
export const Sidebar: React.FC<{ onOpenSettings?: () => void }> = ({ onOpenSettings }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes('admin');
  const primaryRole = userRoles[0] || 'Unassigned';
  const roleLabel = roleLabelMap[primaryRole] || primaryRole.replace(/_/g, ' ');

  const canSee = (roles: string[]) => {
    if (isAdmin || roles.length === 0) return true;
    return roles.some(r => userRoles.includes(r));
  };

  const toggleGroup = (key: string) =>
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const isChildActive = (parent: NavParent) =>
    parent.children.some(c => location.pathname.startsWith(c.href));

  /* Render a single leaf NavLink */
  const renderLeaf = (item: NavChild) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.href}
        to={item.href}
        className={({ isActive }) =>
          `flex items-center justify-between group px-4 py-3 rounded-2xl transition-all duration-300 ${
            isActive
              ? 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`
        }
      >
        {({ isActive: active }) => (
          <>
            <div className="flex items-center gap-3.5">
              <div className={`transition-all duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                <Icon className={`w-4.5 h-4.5 transition-colors ${active ? 'text-cyan-400' : 'group-hover:text-indigo-300'}`} />
              </div>
              <span className={`font-semibold text-xs tracking-tight transition-colors ${active ? 'text-cyan-50' : 'group-hover:text-white'}`}>
                {item.name}
              </span>
            </div>
            {active && (
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            )}
            {!active && (
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
            )}
          </>
        )}
      </NavLink>
    );
  };

  /* Render a collapsible parent group */
  const renderParent = (item: NavParent) => {
    const Icon = item.icon;
    const key = item.name;
    const childActive = isChildActive(item);
    const isOpen = expanded[key] ?? childActive;
    const visibleChildren = item.children.filter(c => canSee(c.roles));
    if (visibleChildren.length === 0) return null;

    return (
      <div key={key}>
        <button
          onClick={() => toggleGroup(key)}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group ${
            childActive && !isOpen
              ? 'bg-white/10 text-white border border-white/5'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-4 h-4 transition-colors ${childActive ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`} />
            <span className="font-medium text-[13px]">{item.name}</span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-0' : '-rotate-90'}`}
          />
        </button>
        {isOpen && (
          <div className="ml-4 pl-3 border-l border-slate-700/50 mt-1 space-y-0.5">
            {visibleChildren.map(renderLeaf)}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-72 bg-enterprise-900 border-r border-slate-800/50 flex flex-col hidden lg:flex shrink-0 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

      <div className="p-6 pb-4 relative z-10">
        <div className="flex flex-col gap-4">
          <img 
            src="/logo.jpg" 
            alt="MFC-Alytix" 
            className="h-16 w-auto object-contain drop-shadow-xl self-start" 
          />
          <div className="flex items-center gap-2 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Enterprise Node</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar relative z-10 space-y-4">
        {sidebarSections.map(section => {
          const visibleItems = section.items.filter(item => canSee(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.section}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] px-4 mb-2">
                {section.section}
              </p>
              <div className="space-y-0.5">
                {visibleItems.map(item =>
                  isNavParent(item) ? renderParent(item) : renderLeaf(item)
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Session Footer - COMPACT RE-DESIGN */}
      <div className="p-4 border-t border-slate-800/40 bg-slate-900/40 backdrop-blur-xl relative z-10 shrink-0">
        <div className="flex items-center gap-2.5 mb-3 px-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-xs shadow-lg border border-white/10 shrink-0 capitalize">
              {user?.sub ? user.sub.charAt(0) : '?'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-[11px] font-black text-white truncate leading-none uppercase tracking-tighter">{user?.sub || 'Operator'}</p>
            <p className="text-[8px] text-indigo-400 font-bold truncate uppercase tracking-[0.05em] mt-1">{roleLabel}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <NavLink
            to="/admin/control-center"
            className={({ isActive }) => 
              `flex items-center justify-center gap-2 text-[9px] font-black transition-all w-full px-3 py-2 rounded-xl border group ${
                isActive 
                ? 'bg-indigo-600 border-indigo-400 text-white' 
                : 'text-indigo-400 border-indigo-500/20 hover:bg-indigo-600/10'
              }`
            }
          >
            <Settings2 className="w-3 h-3 group-hover:rotate-45 transition-transform" />
            SOVEREIGN COMMAND
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-500 hover:text-white transition-all w-full px-3 py-2 rounded-xl border border-slate-800/50 hover:bg-white/5 group"
          >
            <LogOut className="w-3 h-3 transition-transform group-hover:scale-110" />
            TERMINATE SESSION
          </button>
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-800/30 text-center opacity-40 hover:opacity-100 transition-opacity">
           <a 
             href="https://www.linkedin.com/in/mathew-mabira-24861632b" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-[8px] font-black text-slate-500 hover:text-indigo-400 transition-all uppercase tracking-widest flex items-center justify-center gap-1.5"
           >
              <span>Built by Mathew Mabira</span>
              <ArrowRight className="w-2.5 h-2.5" />
           </a>
        </div>
      </div>

    </aside>
  );
};
