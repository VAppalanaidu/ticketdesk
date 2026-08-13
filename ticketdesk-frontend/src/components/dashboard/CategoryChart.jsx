import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export const CategoryChart = ({ categoryMap = {} }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const data = Object.entries(categoryMap).map(([key, value]) => ({
    category: key.replace('_', ' '),
    count: Number(value),
  }));

  const axisTextColor = isDark ? '#cbd5e1' : '#64748b';
  const gridLineColor = isDark ? '#334155' : '#e2e8f0';

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
      <Card.Body className="p-0">
        <h5 className={`fw-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Tickets by Support Category
        </h5>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridLineColor} />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: axisTextColor }} interval={0} angle={-20} textAnchor="end" />
              <YAxis tick={{ fontSize: 11, fill: axisTextColor }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#0f172a',
                  borderColor: isDark ? '#475569' : '#334155',
                  color: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                }}
                cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9' }}
              />
              <Bar dataKey="count" fill={isDark ? '#60a5fa' : '#3b82f6'} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};
