import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const dashboardService = {
  getDashboardStats: async () => {
    const res = await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
    return res.data.data;
  },
};
