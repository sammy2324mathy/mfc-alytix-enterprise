import React from 'react';
import {
  PieChart as ReChartsPie,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
  innerRadius?: number | string;
}

export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'], 
  height = 300,
  innerRadius = '60%'
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReChartsPie>
          <Pie
            data={data}
            innerRadius={innerRadius}
            outerRadius="80%"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </ReChartsPie>
      </ResponsiveContainer>
    </div>
  );
};
