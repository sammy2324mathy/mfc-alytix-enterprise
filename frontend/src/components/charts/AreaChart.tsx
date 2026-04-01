import React from 'react';
import {
  AreaChart as ReChartsArea,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AreaChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color: string;
  height?: number;
}

export const AreaChart: React.FC<AreaChartProps> = ({ data, xKey, yKey, color, height = 300 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReChartsArea data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis 
            hide
          />
          <Tooltip 
            contentStyle={{ 
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorArea)" 
            strokeWidth={3}
          />
        </ReChartsArea>
      </ResponsiveContainer>
    </div>
  );
};
