import React from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ 
  title, 
  subtitle, 
  children, 
  className = "",
  action 
}) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-premium border border-slate-100 ${className}`}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};
