import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Bot, User, Sparkles, Loader2, Paperclip, Eraser, Settings } from 'lucide-react';
import { aiApi } from '../../services/aiApi';
import { useToast } from '../../components/ui/Toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatPage: React.FC = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your Enterprise Actuarial Copilot. I can assist with mortality modeling, stochastic risk analysis, or IFRS 17 compliance queries. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      showToast(err?.response?.data?.detail || 'AI Service Unreachable', 'error');
    }
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = { 
      id: Math.random().toString(36).substr(2, 9), 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate({ 
      message: input,
      session_id: 'enterprise-session-01',
      agent: 'actuary'
    });
    setInput('');
  };

  const clearChat = () => {
    setMessages([messages[0]]);
    showToast('Conversation cleared', 'info');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] animate-fade-in">
      {/* Premium Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-t-3xl shadow-premium-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner">
            <Bot className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">Actuarial Copilot</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neural Intelligence Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearChat} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Clear Chat">
            <Eraser className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-slate-50/30 border-x border-slate-100 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-premium-sm border ${
              msg.role === 'user' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white border-slate-100 text-indigo-600'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            
            <div className={`max-w-[70%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className={`px-5 py-3.5 rounded-3xl shadow-premium-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                <p className="text-[13px] leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter px-2">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {chatMutation.isPending && (
          <div className="flex gap-4 animate-pulse">
            <div className="shrink-0 w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-inner">
               <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            </div>
            <div className="bg-white border border-slate-100 px-6 py-4 rounded-3xl rounded-tl-none shadow-premium-sm">
               <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input Bar */}
      <div className="p-6 bg-white border border-slate-100 rounded-b-3xl shadow-premium">
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-2 rounded-2xl focus-within:bg-white focus-within:border-indigo-200 transition-all shadow-inner group">
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-premium-sm">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your actuarial requirement..."
            className="flex-1 bg-transparent border-none text-[13px] font-semibold focus:ring-0 placeholder:text-slate-400 text-slate-700 h-12"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || chatMutation.isPending}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:grayscale transition-all shadow-premium hover:shadow-indigo-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-3 px-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em]">AI results should be validated by certified professionals.</span>
            <span className="text-[10px] text-slate-300 font-mono">GPT-4 Omni Powered</span>
        </div>
      </div>
    </div>
  );
};
