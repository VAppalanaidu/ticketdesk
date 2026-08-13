import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const authService = {
  login: async (request) => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, request);
    return res.data.data;
  },

  register: async (request) => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, request);
    return res.data.data;
  },

  refreshToken: async (request) => {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, request);
    return res.data.data;
  },

  logout: async (refreshToken) => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
  },

  changePassword: async (request) => {
    await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, request);
  },

  forgotPassword: async (request) => {
    await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, request);
  },

  resetPassword: async (request) => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, request);
  },
};
