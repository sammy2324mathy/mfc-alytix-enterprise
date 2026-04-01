import React from 'react';

type MetricCardProps = {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  trendDirection = 'neutral',
  description,
  icon,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-premium border border-slate-100 p-6 flex flex-col transition-all duration-300 group ${
        onClick ? 'cursor-pointer hover:border-indigo-400 hover:shadow-indigo-500/10 hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        {icon && <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-display font-bold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
              trendDirection === 'up'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : trendDirection === 'down'
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-slate-50 text-slate-700 border border-slate-100'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs font-medium text-slate-400 mt-auto">{description}</p>
      )}
    </div>
  );
};
