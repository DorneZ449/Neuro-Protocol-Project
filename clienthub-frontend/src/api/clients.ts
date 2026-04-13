import api from './axios';
import type { Client, ClientDetails } from '../types';

export interface ClientsResponse {
  clients: Client[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const clientAPI = {
  getAll: async (params?: {
    search?: string;
    tag?: string;
    company?: string;
    page?: number;
    limit?: number;
  }): Promise<ClientsResponse> => {
    const response = await api.get('/clients', { params });
    return response.data;
  },

  getById: async (id: number): Promise<ClientDetails> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (data: Partial<Client>): Promise<Client> => {
    const response = await api.post('/clients', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Client>): Promise<Client> => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};
