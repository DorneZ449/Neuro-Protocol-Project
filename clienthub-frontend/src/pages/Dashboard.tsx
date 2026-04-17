import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../api/dashboard';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../hooks/useCurrency';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { format } = useCurrency();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardAPI.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = data?.stats || { clientsCount: 0, ordersCount: 0, interactionsCount: 0, ordersTotal: 0 };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-app mb-8">Дашборд</h1>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="surface rounded-xl shadow-sm p-6 border border-app hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Клиенты</p>
              <p className="text-3xl font-bold text-app">{stats.clientsCount}</p>
            </div>
            <div className="bg-[var(--primary-bg)] p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="surface rounded-xl shadow-sm p-6 border border-app hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Заказы</p>
              <p className="text-3xl font-bold text-app">{stats.ordersCount}</p>
            </div>
            <div className="bg-[var(--success-bg)] p-3 rounded-lg">
              <svg className="w-8 h-8 text-[var(--success-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="surface rounded-xl shadow-sm p-6 border border-app hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Взаимодействия</p>
              <p className="text-3xl font-bold text-app">{stats.interactionsCount}</p>
            </div>
            <div className="bg-[var(--info-bg)] p-3 rounded-lg">
              <svg className="w-8 h-8 text-[var(--info-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="surface rounded-xl shadow-sm p-6 border border-app hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted mb-1">Сумма заказов</p>
              <p className="text-3xl font-bold text-app whitespace-nowrap">{format(stats.ordersTotal)}</p>
            </div>
            <div className="bg-[var(--warning-bg)] p-3 rounded-lg flex-shrink-0">
              <svg className="w-8 h-8 text-[var(--warning-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Последние клиенты */}
        <div className="surface rounded-xl shadow-sm border border-app">
          <div className="p-6 border-b border-app">
            <h2 className="text-xl font-semibold text-app">Последние клиенты</h2>
          </div>
          <div className="p-6">
            {data?.recentClients && data.recentClients.length > 0 ? (
              <div className="space-y-4">
                {data.recentClients.map((client: any) => (
                  <div
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-[var(--surface-hover)] cursor-pointer transition-colors border border-app"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-app">{client.name}</p>
                      {client.company && (
                        <p className="text-sm text-muted">{client.company}</p>
                      )}
                      {client.email && (
                        <p className="text-sm text-muted">{client.email}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">
                        {new Date(client.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-8">Нет клиентов</p>
            )}
          </div>
        </div>

        {/* Последние взаимодействия */}
        <div className="surface rounded-xl shadow-sm border border-app">
          <div className="p-6 border-b border-app">
            <h2 className="text-xl font-semibold text-app">Последние взаимодействия</h2>
          </div>
          <div className="p-6">
            {data?.recentInteractions && data.recentInteractions.length > 0 ? (
              <div className="space-y-4">
                {data.recentInteractions.map((interaction: any) => (
                  <button
                    key={interaction.id}
                    onClick={() => navigate(`/clients/${interaction.client_id}`)}
                    className="w-full p-4 rounded-lg border border-app hover:bg-[var(--surface-hover)] transition-colors text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--primary-bg)] text-[var(--info-text)]">
                          {interaction.type}
                        </span>
                        <p className="font-medium text-app">{interaction.client_name}</p>
                      </div>
                      <p className="text-xs text-muted">
                        {new Date(interaction.interaction_date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    {interaction.description && (
                      <p className="text-sm text-muted">{interaction.description}</p>
                    )}
                    {interaction.creator_name && (
                      <p className="text-xs text-muted mt-2">Автор: {interaction.creator_name}</p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-8">Нет взаимодействий</p>
            )}
          </div>
        </div>

        {/* Топ клиенты */}
        <div className="surface rounded-xl shadow-sm border border-app lg:col-span-2">
          <div className="p-6 border-b border-app">
            <h2 className="text-xl font-semibold text-app">Топ клиенты по сумме заказов</h2>
          </div>
          <div className="p-6">
            {data?.topClients && data.topClients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-app">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-app whitespace-nowrap">Клиент</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-app whitespace-nowrap">Компания</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-app whitespace-nowrap">Заказы</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-app whitespace-nowrap">Взаимодействия</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-app whitespace-nowrap">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topClients.map((client: any) => (
                      <tr
                        key={client.id}
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="border-b border-app hover:bg-[var(--surface-hover)] cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-app">{client.name}</td>
                        <td className="py-3 px-4 text-sm text-muted">{client.company || '-'}</td>
                        <td className="py-3 px-4 text-sm text-center text-app">{client.orders_count}</td>
                        <td className="py-3 px-4 text-sm text-center text-app">{client.interactions_count}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-app whitespace-nowrap">
                          {format(parseFloat(client.total_amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-center py-8">Нет данных</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
