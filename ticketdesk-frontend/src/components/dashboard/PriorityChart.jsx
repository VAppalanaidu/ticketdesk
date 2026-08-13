import React from 'react';
import { Card } from 'react-bootstrap';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const PRIORITY_COLORS = {
  LOW: '#10b981',
  MEDIUM: '#3b82f6',
  HIGH: '#f59e0b',
  CRITICAL: '#ef4444',
};

const PRIORITY_LABELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 16;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const label = PRIORITY_LABELS[name] || name;
  const color = PRIORITY_COLORS[name] || '#475569';

  return (
    <text
      x={x}
      y={y}
      fill={color}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '11px', fontWeight: 700 }}
    >
      {`${label} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PriorityChart = ({ priorityMap = {} }) => {
  const allData = Object.entries(priorityMap).map(([key, value]) => ({
    name: key,
    label: PRIORITY_LABELS[key] || key,
    value: Number(value) || 0,
  }));

  const totalTickets = allData.reduce((sum, item) => sum + item.value, 0);

  // Filter out 0-value items so pie slices and hover tooltips only render for active data
  const chartData = allData.filter((item) => item.value > 0);

  return (
    <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
      <Card.Body className="p-0 d-flex flex-column">
        {/* Card Header */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-bold text-slate-800 mb-0">Priority Distribution</h5>
          <span className="badge bg-light text-slate-600 border font-monospace px-2.5 py-1.5 rounded-pill text-xs">
            {totalTickets} Total
          </span>
        </div>

        {totalTickets === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5 text-slate-400 text-center">
            <span className="text-sm fw-medium">No priority data available</span>
            <span className="text-2xs text-muted mt-1">No tickets recorded in system</span>
          </div>
        ) : (
          <>
            {/* Dedicated Responsive Chart Wrapper with ample padding & height */}
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
                      <Cell key={`cell-${entry.name}`} fill={PRIORITY_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, item) => [
                      `${value} Ticket${value === 1 ? '' : 's'} (${((value / (totalTickets || 1)) * 100).toFixed(0)}%)`,
                      PRIORITY_LABELS[item.payload.name] || name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      color: '#fff',
                      borderRadius: '10px',
                      fontSize: '12px',
                      padding: '8px 12px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 600 }}
                  />
                  {/* Center Donut Label */}
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-4" fontSize="18" fontWeight="bold" fill="#0f172a">
                      {totalTickets}
                    </tspan>
                    <tspan x="50%" dy="18" fontSize="10" fontWeight="600" fill="#64748b">
                      Tickets
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Clean Summary Grid for ALL 4 categories */}
            <div className="row g-2 mt-auto pt-2 border-top border-slate-100 text-xs">
              {allData.map((item) => (
                <div key={item.name} className="col-6 col-md-3">
                  <div className="p-2 rounded-3 bg-slate-50 border border-slate-100 text-center">
                    <div className="d-flex align-items-center justify-content-center gap-1.5 mb-1">
                      <span
                        className="d-inline-block rounded-circle"
                        style={{ width: 8, height: 8, backgroundColor: PRIORITY_COLORS[item.name] || '#94a3b8' }}
                      />
                      <span className="fw-semibold text-slate-700">{item.label}</span>
                    </div>
                    <span className="fw-bold font-monospace text-slate-900 fs-6">{item.value}</span>
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
