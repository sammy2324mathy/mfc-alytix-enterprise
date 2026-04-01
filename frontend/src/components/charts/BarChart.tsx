import React from 'react';
import {
  BarChart as ReChartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  colors?: string[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  xKey, 
  yKey, 
  colors = ['#6366f1'], 
  height = 300 
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReChartsBar data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </ReChartsBar>
      </ResponsiveContainer>
    </div>
  );
};
