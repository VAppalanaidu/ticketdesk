import React from 'react';
import { Card } from 'react-bootstrap';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const STATUS_COLORS = {
  Open: '#06b6d4',
  'In Progress': '#f59e0b',
  Resolved: '#10b981',
  Closed: '#64748b',
};

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 16;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const color = STATUS_COLORS[name] || '#94a3b8';

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '11px', fontWeight: 700 }}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const StatusChart = ({ stats }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const allData = [
    { name: 'Open', value: stats?.openTickets || 0 },
    { name: 'In Progress', value: stats?.inProgressTickets || 0 },
    { name: 'Resolved', value: stats?.resolvedTickets || 0 },
    { name: 'Closed', value: stats?.closedTickets || 0 },
  ];

  const total = allData.reduce((acc, curr) => acc + curr.value, 0);
  const chartData = allData.filter((item) => item.value > 0);

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
      <Card.Body className="p-0 d-flex flex-column">
        {/* Card Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className={`fw-bold mb-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ticket Status Breakdown
          </h5>
          <span className={`badge border font-monospace px-2.5 py-1.5 rounded-pill text-xs ${
            isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-light text-slate-600 border-slate-200'
          }`}>
            {total} Total
          </span>
        </div>

        {total === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5 text-center">
            <span className={`text-sm fw-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              No status data available
            </span>
            <span className="text-2xs text-muted mt-1">No active tickets found in system</span>
          </div>
        ) : (
          <>
            {/* Dedicated Responsive Chart Wrapper */}
            <div style={{ width: '100%', height: 230, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 35, bottom: 20, left: 35 }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={66}
                    paddingAngle={chartData.length > 1 ? 4 : 0}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {chartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} Ticket${value === 1 ? '' : 's'} (${((value / (total || 1)) * 100).toFixed(0)}%)`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: isDark ? '#1e293b' : '#0f172a',
                      borderColor: isDark ? '#475569' : '#334155',
                      color: '#ffffff',
                      borderRadius: '10px',
                      fontSize: '12px',
                      padding: '8px 12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                    }}
                    itemStyle={{ color: '#ffffff', fontWeight: 600 }}
                  />
                  {/* Center Donut Label */}
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-4" fontSize="18" fontWeight="bold" fill={isDark ? '#f8fafc' : '#0f172a'}>
                      {total}
                    </tspan>
                    <tspan x="50%" dy="18" fontSize="10" fontWeight="600" fill={isDark ? '#cbd5e1' : '#64748b'}>
                      Tickets
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Grid */}
            <div className={`row g-2 mt-auto pt-2 border-top text-xs ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              {allData.map((item) => (
                <div key={item.name} className="col-6 col-md-3">
                  <div className={`p-2 rounded-3 border text-center ${
                    isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="d-flex align-items-center justify-content-center gap-1.5 mb-1">
                      <span
                        className="d-inline-block rounded-circle"
                        style={{ width: 8, height: 8, backgroundColor: STATUS_COLORS[item.name] || '#94a3b8' }}
                      />
                      <span className={`fw-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.name}</span>
                    </div>
                    <span className={`fw-bold font-monospace fs-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
