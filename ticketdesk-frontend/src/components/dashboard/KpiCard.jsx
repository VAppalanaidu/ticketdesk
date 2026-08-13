import React from 'react';
import { Card } from 'react-bootstrap';

export const KpiCard = ({ title, count, icon, subtitle, variant = 'primary', className = '' }) => {
  return (
    <Card className={`border-0 shadow-sm rounded-4 h-100 overflow-hidden transition-all card-hover ${className}`}>
      <Card.Body className="p-4 d-flex flex-column justify-content-between">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="text-slate-500 text-xs fw-bold font-monospace text-uppercase tracking-wider">
            {title}
          </span>
          <div className={`p-2.5 rounded-3 bg-${variant} bg-opacity-10 text-${variant} shadow-2xs`}>
            {icon}
          </div>
        </div>
        <div>
          <h2 className="display-6 fw-extrabold text-slate-900 mb-1 font-monospace">{count}</h2>
          {subtitle && <p className="text-muted text-xs mb-0">{subtitle}</p>}
        </div>
      </Card.Body>
    </Card>
  );
};
