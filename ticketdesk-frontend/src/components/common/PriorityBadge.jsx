import React from 'react';
import { Badge } from 'react-bootstrap';
import { AlertCircle, AlertOctagon, AlertTriangle, ArrowDown } from 'lucide-react';
import { TICKET_PRIORITY_CONFIG } from '../../constants/ticketConstants';

export const PriorityBadge = ({ priority, className = '', showIcon = true }) => {
  const config = TICKET_PRIORITY_CONFIG[priority] || { label: priority, variant: 'secondary' };

  const renderIcon = () => {
    if (!showIcon) return null;
    const iconSize = 13;
    switch (priority) {
      case 'LOW':
        return <ArrowDown size={iconSize} className="me-1" />;
      case 'MEDIUM':
        return <AlertCircle size={iconSize} className="me-1" />;
      case 'HIGH':
        return <AlertTriangle size={iconSize} className="me-1" />;
      case 'CRITICAL':
        return <AlertOctagon size={iconSize} className="me-1 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <Badge
      bg={config.variant}
      className={`rounded-md px-2.5 py-1 text-xs fw-semibold d-inline-flex align-items-center ${className}`}
    >
      {renderIcon()}
      {config.label}
    </Badge>
  );
};
