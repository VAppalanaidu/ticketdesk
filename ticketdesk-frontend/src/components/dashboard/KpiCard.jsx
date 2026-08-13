import React from 'react';
import { Card } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';

export const KpiCard = ({ title, count, icon, subtitle, variant = 'primary', className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Card className={`border-0 shadow-sm rounded-4 h-100 overflow-hidden transition-all card-hover ${className}`}>
      <Card.Body className="p-4 d-flex flex-column justify-content-between">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className={`text-xs fw-bold font-monospace text-uppercase tracking-wider ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {title}
          </span>
          <div className={`p-2.5 rounded-3 bg-${variant} bg-opacity-10 text-${variant} shadow-2xs`}>
            {icon}
          </div>
        </div>
        <div>
          <h2 className={`display-6 fw-extrabold mb-1 font-monospace ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {count}
          </h2>
          {subtitle && (
            <p className={`text-xs mb-0 ${isDark ? 'text-slate-400' : 'text-muted'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
