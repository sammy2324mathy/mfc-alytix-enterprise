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
    section: 'Professional Hub',
    roles: [ ...FINANCE, ...RISK, ...ACTUARIAL, ...DATA_SCI ],
    items: [
      {
        name: 'Accountability & Ledger',
        icon: Calculator,
        roles: FINANCE,
        basePath: '/accounting',
        children: [
          { name: 'General Ledger', href: '/accounting/ledger', icon: BookOpen, roles: FINANCE },
          { name: 'Accounts Receivable', href: '/accounting/ar', icon: CreditCard, roles: FINANCE },
          { name: 'Accounts Payable', href: '/accounting/ap', icon: Wallet, roles: FINANCE },
          { name: 'Payment Processing', href: '/accounting/payments', icon: Banknote, roles: FINANCE },
          { name: 'Treasury Management', href: '/accounting/treasury', icon: PieChart, roles: FINANCE_SENIOR },
          { name: 'Integration Hub', href: '/accounting/integrations', icon: Database, roles: FINANCE },
          { name: 'Review Proposals', href: '/accounting/proposals', icon: Fingerprint, roles: ['chief_accountant', 'admin'] },
        ],
      },
      {
        name: 'Insurance & Assurance',
        icon: Shield,
        roles: ['junior_accountant', 'chief_accountant', 'actuary', 'actuarial_analyst', 'chief_actuary'],
        basePath: '/insurance',
        children: [
          { name: 'Policy Management', href: '/insurance/policies', icon: Shield, roles: ['junior_accountant', 'chief_accountant', 'actuary', 'actuarial_analyst', 'chief_actuary'] },
          { name: 'New Enrollment', href: '/insurance/enroll', icon: FileText, roles: ['junior_accountant', 'chief_accountant', 'actuary', 'actuarial_analyst', 'chief_actuary'] },
          { name: 'Claims Management', href: '/insurance/claims', icon: Gavel, roles: ['junior_accountant', 'chief_accountant', 'actuary', 'actuarial_analyst', 'chief_actuary'] },
        ],
      },
      {
        name: 'SECURITY & GOVERNANCE',
        roles: ['admin', 'cro'],
        icon: ShieldCheck,
        basePath: '/security', // Added basePath as it's required by NavParent interface
        children: [
          { name: 'Sovereign Security', href: '/security', icon: Lock, roles: ['admin', 'cro'] },
          { name: 'Regulatory Reporting', href: '/compliance/reporting', icon: FileText, roles: COMPLIANCE },
          { name: 'Governance Center', href: '/compliance/signoff', icon: FileCheck, roles: COMPLIANCE },
        ]
      },
      {
        name: 'High-Complexity Risk',
        icon: ShieldAlert,
        roles: RISK,
        basePath: '/risk',
        children: [
          { name: 'Capital Modeling', href: '/risk/capital', icon: Shield, roles: RISK },
          { name: 'Reinsurance Gateway', href: '/risk/reinsurance', icon: Gavel, roles: ['cro', 'admin'] },
          { name: 'Regulatory Hub', href: '/compliance', icon: FileCheck, roles: COMPLIANCE },
          { name: 'Actuarial Scientific Lab', href: '/actuarial', icon: LineChart, roles: ACTUARIAL },
          { name: 'ALM & Capital Strategy', href: '/actuarial/alm', icon: BarChart3, roles: ACTUARIAL },
        ],
      },
      {
        name: 'Advanced Intelligence',
        icon: Microscope,
        roles: DATA_SCI,
        basePath: '/data-science',
        children: [
          { name: 'Neural Model Governance', href: '/data-science/data', icon: BrainCircuit, roles: DATA_SCI },
          { name: 'Fraud Investigations', href: '/data-science/fraud', icon: ShieldAlert, roles: DATA_SCI },
        ],
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
          `flex items-center justify-between group px-4 py-2.5 rounded-xl transition-all duration-200 ${
            isActive
              ? 'bg-white/10 text-white shadow-sm border border-white/5'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`
        }
      >
        {({ isActive: active }) => (
          <>
            <div className="flex items-center gap-3">
              <Icon className={`w-4 h-4 transition-colors ${active ? 'text-indigo-400' : 'group-hover:text-indigo-300'}`} />
              <span className="font-medium text-[13px]">{item.name}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
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

      {/* User Session Footer */}
      <div className="p-5 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-enterprise-600 flex items-center justify-center text-white font-bold text-base shadow-premium border border-white/10">
              {user?.sub ? user.sub.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-white truncate leading-tight">{user?.sub || 'Operator'}</p>
            <p className="text-[10px] text-indigo-400 font-bold truncate uppercase tracking-tight mt-0.5">{roleLabel}</p>
          </div>
        </div>
        <NavLink
          to="/admin/control-center"
          className={({ isActive }) => 
            `flex items-center justify-center gap-2.5 text-xs font-bold transition-all w-full px-4 py-3 rounded-xl border mb-2 group shadow-lg ${
              isActive 
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/20' 
              : 'text-indigo-400 border-indigo-500/30 hover:bg-indigo-600/10 shadow-indigo-500/5'
            }`
          }
        >
          <Settings2 className="w-4 h-4 transition-transform group-hover:rotate-45" />
          Sovereign Command
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2.5 text-xs font-bold text-slate-400 hover:text-white transition-all w-full px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-white/5 group"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
          Terminate Session
        </button>
        
        <div className="mt-4 pt-4 border-t border-slate-800/30 text-center">
           <a 
             href="https://www.linkedin.com/in/mathew-mabira-24861632b" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-[9px] font-black text-slate-500 hover:text-indigo-400 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group"
           >
              <span>Built by Mathew Mabira</span>
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform" />
           </a>
        </div>
      </div>
    </aside>
  );
};
