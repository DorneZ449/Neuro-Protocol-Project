import api from './axios';
import type { Order, Interaction, Comment } from '../types';

export const orderAPI = {
  create: async (data: Partial<Order>): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Order>): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};

export const interactionAPI = {
  create: async (data: Partial<Interaction>): Promise<Interaction> => {
    const response = await api.post('/interactions', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/interactions/${id}`);
  },
};

export const commentAPI = {
  create: async (data: Partial<Comment>): Promise<Comment> => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};
