export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  TICKETS: {
    BASE: '/tickets',
    BY_ID: (id) => `/tickets/${id}`,
    BY_NUMBER: (number) => `/tickets/number/${number}`,
    MY_TICKETS: '/tickets/my-tickets',
    BY_STATUS: (status) => `/tickets/status/${status}`,
    BY_PRIORITY: (priority) => `/tickets/priority/${priority}`,
    BY_CATEGORY: (category) => `/tickets/category/${category}`,
    ASSIGN: (id) => `/tickets/${id}/assign`,
    STATUS: (id) => `/tickets/${id}/status`,
    ATTACHMENTS: (id) => `/tickets/${id}/attachments`,
    COMMENTS: (id) => `/tickets/${id}/comments`,
  },
  COMMENTS: {
    BY_ID: (id) => `/comments/${id}`,
  },
  ATTACHMENTS: {
    BY_ID: (id) => `/attachments/${id}`,
    DOWNLOAD: (id) => `/attachments/${id}/download`,
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    SEARCH: '/users/search',
    BY_ID: (id) => `/users/${id}`,
    ACTIVATE: (id) => `/users/${id}/activate`,
    DEACTIVATE: (id) => `/users/${id}/deactivate`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },
};
