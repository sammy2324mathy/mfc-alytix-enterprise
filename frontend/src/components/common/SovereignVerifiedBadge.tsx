import React from 'react';
import { ShieldCheck, Lock, Zap } from 'lucide-react';

interface SovereignVerifiedBadgeProps {
  signature?: string;
  className?: string;
  variant?: 'compact' | 'full';
}

export const SovereignVerifiedBadge: React.FC<SovereignVerifiedBadgeProps> = ({ 
  signature, 
  className = "", 
  variant = 'full' 
}) => {
  if (!signature) return null;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full animate-in zoom-in duration-500 shadow-sm ${className}`}>
      <div className="relative">
         <ShieldCheck className="w-4 h-4 text-emerald-600 relative z-10" />
         <div className="absolute inset-0 bg-emerald-400/20 blur-sm rounded-full animate-pulse" />
      </div>
      
      {variant === 'full' && (
        <div className="flex flex-col">
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">Sovereign Verified</span>
            <span className="text-[7px] font-mono text-emerald-600/60 uppercase tracking-tighter mt-0.5 truncate max-w-[60px]">
                SIGN: {signature.substring(0, 8)}...
            </span>
        </div>
      )}
      
      <Zap className="w-2.5 h-2.5 text-emerald-400 ml-1" />
    </div>
  );
};
