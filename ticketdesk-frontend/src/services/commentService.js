import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const commentService = {
  addComment: async (ticketId, request) => {
    const res = await apiClient.post(API_ENDPOINTS.TICKETS.COMMENTS(ticketId), request);
    return res.data.data;
  },

  getTicketComments: async (ticketId, params) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.COMMENTS(ticketId), { params });
    return res.data.data;
  },

  updateComment: async (commentId, request) => {
    const res = await apiClient.put(API_ENDPOINTS.COMMENTS.BY_ID(commentId), request);
    return res.data.data;
  },

  deleteComment: async (commentId) => {
    await apiClient.delete(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
  },
};
