import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const attachmentService = {
  uploadAttachment: async (ticketId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post(API_ENDPOINTS.TICKETS.ATTACHMENTS(ticketId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  replaceAttachment: async (ticketId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.put(API_ENDPOINTS.TICKETS.ATTACHMENTS(ticketId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  getAttachmentByTicket: async (ticketId) => {
    const res = await apiClient.get(API_ENDPOINTS.TICKETS.ATTACHMENTS(ticketId));
    return res.data.data;
  },

  getAttachmentById: async (attachmentId) => {
    const res = await apiClient.get(API_ENDPOINTS.ATTACHMENTS.BY_ID(attachmentId));
    return res.data.data;
  },

  downloadAttachment: async (attachmentId, fileName) => {
    const response = await apiClient.get(API_ENDPOINTS.ATTACHMENTS.DOWNLOAD(attachmentId), {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  deleteAttachment: async (ticketId) => {
    await apiClient.delete(API_ENDPOINTS.TICKETS.ATTACHMENTS(ticketId));
  },
};
