import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  BrainCircuit,
  ChevronRight,
  Database,
  FlaskConical,
  Lock,
  MessageSquare,
  Settings2,
  Sparkles,
} from 'lucide-react';

interface AINavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  dsOnly?: boolean;
}

interface AINavGroup {
  id: string;
  title: string;
  items: AINavItem[];
}

const AI_NAV: AINavGroup[] = [
  {
    id: 'assistant',
    title: 'AI Copilot',
    items: [
      { name: 'Chat Assistant', href: '/ai/chat', icon: <MessageSquare className="w-4 h-4" />, description: 'Natural language queries across actuarial data' },
      { name: 'Knowledge Base', href: '/ai/knowledge', icon: <Database className="w-4 h-4" />, description: 'RAG document sources and vector stores' },
    ],
  },
  {
    id: 'configuration',
    title: 'Model Management',
    items: [
      { name: 'Model Config', href: '/ai/config', icon: <Settings2 className="w-4 h-4" />, description: 'Inference parameters, temperature, embeddings' },
      { name: 'Experiments', href: '/ai/experiments', icon: <FlaskConical className="w-4 h-4" />, description: 'A/B tests, finetune tracking, and evaluations', dsOnly: true },
    ],
  },
];

export const AILayout: React.FC = () => {
  const location = useLocation();
  const roles = useAuthStore((s) => s.user?.roles);
  const isDS = roles?.includes('data_scientist') || roles?.includes('admin');

  return (
    <div className="flex h-full gap-0 -m-6 md:-m-8">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Assistant</h2>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-100 text-violet-700">BETA</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isDS ? 'Data Scientist — full model control' : 'Actuarial Copilot — query & insights'}
          </p>
        </div>

        <nav className="flex-1 py-3">
          {AI_NAV.map((group) => {
            const visible = group.items.filter(item => !item.dsOnly || isDS);
            if (!visible.length) return null;
            return (
              <div key={group.id} className="mb-1">
                <div className="px-5 pt-4 pb-1.5">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.title}</h3>
                </div>
                <ul className="space-y-0.5 px-2">
                  {visible.map((item) => {
                    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                    return (
                      <li key={item.href}>
                        <NavLink to={item.href} title={item.description}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group
                            ${isActive ? 'bg-violet-50 text-violet-800 shadow-sm border border-violet-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}>
                          <span className={`shrink-0 ${isActive ? 'text-violet-600' : 'text-slate-400 group-hover:text-slate-500'}`}>{item.icon}</span>
                          <span className="flex-1 truncate">{item.name}</span>
                          {item.dsOnly && <Lock className="w-3 h-3 text-violet-400 shrink-0" />}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-500 shrink-0" />}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>Model: <span className="font-semibold text-slate-500">GPT-4o</span></span>
            </div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-3 h-3 text-violet-400" />
              <span>RAG Docs: <span className="font-semibold text-slate-500">1,204 indexed</span></span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30">
        <Outlet />
      </div>
    </div>
  );
};
