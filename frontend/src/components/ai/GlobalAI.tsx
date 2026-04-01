import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Loader2, 
  MessageSquare,
  ChevronLeft,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { aiApi } from '../../services/aiApi';
import { useToast } from '../ui/Toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const GlobalAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Enterprise Intelligence Active. I can assist with queries across Accounting, Risk, and Actuarial modules. How can I help you in your current workspace?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const location = useLocation();
  const { showToast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const chatMutation = useMutation({
    mutationFn: aiApi.chat,
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: data.data.reply,
        timestamp: new Date()
      }]);
    },
    onError: (err: any) => {
      showToast(err?.response?.data?.detail || 'AI Service Connection Interrupted', 'error');
    }
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    
    // Determine context from location
    const context = location.pathname.split('/')[1] || 'general';
    
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate({
      message: input,
      session_id: 'global-enterprise-session',
      agent: context === 'actuarial' ? 'actuary' : context === 'accounting' ? 'accountant' : 'general'
    });
    setInput('');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all duration-300 z-50 flex items-center justify-center group"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        <Bot className="w-7 h-7" />
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-widest">Open Intelligence Assistant</span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ease-out flex flex-col ${
      isMinimized ? 'w-80 h-16' : 'w-[420px] h-[600px]'
    }`}>
      <div className="bg-white rounded-[32px] shadow-[0_32px_100px_-16px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <div className="p-5 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
               <Sparkles className="w-5 h-5 text-white" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-slate-900 leading-none">Enterprise Copilot</h3>
                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Real-time Node</p>
             </div>
          </div>
          <div className="flex items-center gap-1">
             <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all">
               {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
             </button>
             <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl transition-all">
               <X className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white/50 backdrop-blur-sm">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-[10px] font-bold ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-indigo-600'
                  }`}>
                    {msg.role === 'user' ? 'U' : 'AI'}
                  </div>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[12px] font-medium leading-relaxed font-sans ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex gap-3 animate-pulse">
                   <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0" />
                   <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                   </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-2xl focus-within:bg-white focus-within:border-indigo-200 transition-all shadow-inner">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about this workspace..."
                  className="flex-1 bg-transparent border-none text-[12px] font-bold focus:ring-0 placeholder:text-slate-400 text-slate-700 h-10 px-3"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || chatMutation.isPending}
                  className="w-10 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center transition-all shadow-lg hover:shadow-indigo-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
