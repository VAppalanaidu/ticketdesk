import React from 'react';
import { Badge } from 'react-bootstrap';
import { TICKET_STATUS_CONFIG } from '../../constants/ticketConstants';

export const StatusBadge = ({ status, className = '', size = 'md' }) => {
  const config = TICKET_STATUS_CONFIG[status] || { label: status, variant: 'secondary' };

  let sizeClass = 'px-3 py-1 text-xs fw-semibold';
  if (size === 'sm') sizeClass = 'px-2 py-0.5 text-2xs fw-medium';
  if (size === 'lg') sizeClass = 'px-4 py-1.5 text-sm fw-bold';

  return (
    <Badge
      bg={config.variant}
      className={`rounded-pill text-uppercase tracking-wider shadow-sm ${sizeClass} ${className}`}
      style={{ letterSpacing: '0.05em' }}
    >
      <span className="d-inline-block rounded-circle me-1.5 bg-white opacity-75" style={{ width: 6, height: 6 }} />
      {config.label}
    </Badge>
  );
};
