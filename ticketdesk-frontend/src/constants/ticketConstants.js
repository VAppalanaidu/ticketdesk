export const TICKET_STATUS_CONFIG = {
  OPEN: {
    label: 'Open',
    variant: 'info',
    allowedTransitions: ['IN_PROGRESS', 'CLOSED'],
  },
  IN_PROGRESS: {
    label: 'In Progress',
    variant: 'warning',
    allowedTransitions: ['RESOLVED', 'CLOSED'],
  },
  RESOLVED: {
    label: 'Resolved',
    variant: 'success',
    allowedTransitions: ['CLOSED', 'IN_PROGRESS'],
  },
  CLOSED: {
    label: 'Closed',
    variant: 'secondary',
    allowedTransitions: ['OPEN'],
  },
};

export const TICKET_PRIORITY_CONFIG = {
  LOW: { label: 'Low', variant: 'success', badgeColor: '#10b981', level: 1 },
  MEDIUM: { label: 'Medium', variant: 'info', badgeColor: '#3b82f6', level: 2 },
  HIGH: { label: 'High', variant: 'warning', badgeColor: '#f59e0b', level: 3 },
  CRITICAL: { label: 'Critical', variant: 'danger', badgeColor: '#ef4444', level: 4 },
};

export const TICKET_CATEGORY_CONFIG = {
  SOFTWARE: { label: 'Software', iconName: 'Code' },
  HARDWARE: { label: 'Hardware', iconName: 'Cpu' },
  NETWORK: { label: 'Network', iconName: 'Wifi' },
  EMAIL: { label: 'Email', iconName: 'Mail' },
  VPN: { label: 'VPN Access', iconName: 'Shield' },
  ACCESS_REQUEST: { label: 'Access Request', iconName: 'Key' },
  DATABASE: { label: 'Database', iconName: 'Database' },
  OTHER: { label: 'Other', iconName: 'HelpCircle' },
};

export const ROLE_CONFIG = {
  ADMIN: { label: 'Administrator', badgeVariant: 'danger' },
  SUPPORT_ENGINEER: { label: 'Support Engineer', badgeVariant: 'primary' },
  EMPLOYEE: { label: 'Employee / User', badgeVariant: 'success' },
};
