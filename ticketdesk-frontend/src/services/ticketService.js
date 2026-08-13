import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const ticketService = {
  createTicket: async (request) => {
    const res = await apiClient.post(API_ENDPOINTS.TICKETS.BASE, request);
    return res.data.data;
  },

  getTicketById: async (id) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.BY_ID(id));
    return res.data.data;
  },

  getTicketByNumber: async (ticketNumber) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.BY_NUMBER(ticketNumber));
    return res.data.data;
  },

  getAllTickets: async (params) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.BASE, { params });
    return res.data.data;
  },

  getMyTickets: async (params) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.MY_TICKETS, { params });
    return res.data.data;
  },

  getTicketsByStatus: async (status, params) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.BY_STATUS(status), { params });
    return res.data.data;
  },

  getTicketsByPriority: async (priority, params) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.BY_PRIORITY(priority), { params });
    return res.data.data;
  },

  getTicketsByCategory: async (category, params) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.BY_CATEGORY(category), { params });
    return res.data.data;
  },

  updateTicket: async (id, request) => {
    const res = await apiClient.put(API_ENDPOINTS.TICKETS.BY_ID(id), request);
    return res.data.data;
  },

  deleteTicket: async (id) => {
    await apiClient.delete(API_ENDPOINTS.TICKETS.BY_ID(id));
  },

  assignEngineer: async (id, request) => {
    const res = await apiClient.patch(API_ENDPOINTS.TICKETS.ASSIGN(id), request);
    return res.data.data;
  },

  updateStatus: async (id, request) => {
    const res = await apiClient.patch(API_ENDPOINTS.TICKETS.STATUS(id), request);
    return res.data.data;
  },
};
