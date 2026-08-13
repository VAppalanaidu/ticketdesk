import React from 'react';
import { Badge } from 'react-bootstrap';
import {
  Code,
  Cpu,
  Database,
  HelpCircle,
  Key,
  Mail,
  Shield,
  Wifi,
} from 'lucide-react';
import { TICKET_CATEGORY_CONFIG } from '../../constants/ticketConstants';

export const CategoryBadge = ({ category, className = '' }) => {
  const config = TICKET_CATEGORY_CONFIG[category] || { label: category, iconName: 'HelpCircle' };

  const renderIcon = () => {
    const size = 13;
    switch (category) {
      case 'SOFTWARE':
        return <Code size={size} className="me-1 text-primary" />;
      case 'HARDWARE':
        return <Cpu size={size} className="me-1 text-warning" />;
      case 'NETWORK':
        return <Wifi size={size} className="me-1 text-info" />;
      case 'EMAIL':
        return <Mail size={size} className="me-1 text-secondary" />;
      case 'VPN':
        return <Shield size={size} className="me-1 text-success" />;
      case 'ACCESS_REQUEST':
        return <Key size={size} className="me-1 text-indigo" />;
      case 'DATABASE':
        return <Database size={size} className="me-1 text-danger" />;
      default:
        return <HelpCircle size={size} className="me-1" />;
    }
  };

  return (
    <Badge
      bg="light"
      text="dark"
      className={`border border-slate-200 px-2.5 py-1 text-xs fw-medium d-inline-flex align-items-center rounded-md ${className}`}
    >
      {renderIcon()}
      {config.label}
    </Badge>
  );
};
