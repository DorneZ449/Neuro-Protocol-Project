import api from './axios';

export interface DashboardStats {
  stats: {
    clientsCount: number;
    ordersCount: number;
    interactionsCount: number;
    ordersTotal: number;
  };
  recentClients: any[];
  recentInteractions: any[];
  topClients: any[];
}

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};
