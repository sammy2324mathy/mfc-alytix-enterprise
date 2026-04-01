import React from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class EnterpriseErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fcfdfe] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-[40px] shadow-premium border border-slate-100 p-12 text-center space-y-8 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[32px] flex items-center justify-center mx-auto border border-rose-100 animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Node Desynchronized</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                A temporary cryptographic mismatch occurred in this departmental node. The Sovereign Core has isolated the error.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-premium-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-Sync Node
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-premium-sm"
              >
                <Home className="w-3.5 h-3.5" /> Core Terminal
              </button>
            </div>
            
            <div className="pt-4 border-t border-slate-50">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Error isolated by Sovereign Guardian v1.0</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
