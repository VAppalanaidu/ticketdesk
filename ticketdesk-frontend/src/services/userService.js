import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const userService = {
  getCurrentUserProfile: async () => {
    const res = await apiClient.get(API_ENDPOINTS.USERS.ME);
    return res.data.data;
  },

  createUser: async (request) => {
    const res = await apiClient.post(API_ENDPOINTS.USERS.BASE, request);
    return res.data.data;
  },

  createSupportEngineer: async (request) => {
    const res = await apiClient.post('/users/support-engineers', request);
    return res.data.data;
  },

  getSupportEngineers: async () => {
    const res = await apiClient.get('/users/support-engineers');
    return res.data.data;
  },

  getUserById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.USERS.BY_ID(id));
    return res.data.data;
  },

  getAllUsers: async (params) => {
    const res = await apiClient.get(API_ENDPOINTS.USERS.BASE, { params });
    return res.data.data;
  },

  searchUsers: async (params) => {
    const res = await apiClient.get(API_ENDPOINTS.USERS.SEARCH, { params });
    return res.data.data;
  },

  updateUser: async (id, request) => {
    const res = await apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), request);
    return res.data.data;
  },

  deleteUser: async (id) => {
    await apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  activateUser: async (id) => {
    const res = await apiClient.patch(API_ENDPOINTS.USERS.ACTIVATE(id));
    return res.data.data;
  },

  deactivateUser: async (id) => {
    const res = await apiClient.patch(API_ENDPOINTS.USERS.DEACTIVATE(id));
    return res.data.data;
  },
};
