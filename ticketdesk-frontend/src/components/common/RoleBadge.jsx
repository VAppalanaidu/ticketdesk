import React from 'react';
import { Badge } from 'react-bootstrap';
import { ROLE_CONFIG } from '../../constants/ticketConstants';

export const RoleBadge = ({ role, className = '' }) => {
  const config = ROLE_CONFIG[role] || { label: role, badgeVariant: 'secondary' };

  return (
    <Badge
      bg={config.badgeVariant}
      className={`px-2.5 py-1 text-xs fw-semibold rounded-md ${className}`}
    >
      {config.label}
    </Badge>
  );
};
