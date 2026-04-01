import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { Loader2 } from 'lucide-react';

export type MortalityRatePoint = {
  age: number;
  maleQx: number;
  femaleQx: number;
};

export type MortalityRatesProps = {
  data: MortalityRatePoint[];
  loading?: boolean;
  title?: string;
  maleLabel?: string;
  femaleLabel?: string;
  className?: string;
};

export const MortalityRates: React.FC<MortalityRatesProps> = ({
  data,
  loading = false,
  title = 'Base Mortality Curve (1000 × qx)',
  maleLabel = 'Male',
  femaleLabel = 'Female',
  className = '',
}) => {
  return (
    <div
      className={`lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all hover:shadow-md ${className}`}
    >
      <div className="flex justify-between flex-wrap gap-4 mb-6">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <div className="flex gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full bg-sky-500 shadow-sm" />
            {maleLabel}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="w-3 h-3 rounded-full bg-indigo-400 shadow-sm" />
            {femaleLabel}
          </span>
        </div>
      </div>
      <div className="h-[350px] w-full mt-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="age"
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
              />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow:
                    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: any) => [
                  <span className="font-semibold text-slate-900" key="v">
                    {Number(value).toFixed(2)}
                  </span>,
                  <span className="text-slate-500" key="u">
                    Rate per 1000
                  </span>,
                ]}
                labelFormatter={(label) => (
                  <span className="text-slate-500 font-medium">Age {label}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="maleQx"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
              />
              <Line
                type="monotone"
                dataKey="femaleQx"
                stroke="#818cf8"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
