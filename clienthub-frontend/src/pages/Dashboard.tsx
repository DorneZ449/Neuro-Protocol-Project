import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../api/dashboard';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Дашборд</h1>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Клиенты</p>
              <p className="text-3xl font-bold text-gray-800">{stats.clientsCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Заказы</p>
              <p className="text-3xl font-bold text-gray-800">{stats.ordersCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Взаимодействия</p>
              <p className="text-3xl font-bold text-gray-800">{stats.interactionsCount}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Сумма заказов</p>
              <p className="text-3xl font-bold text-gray-800">{stats.ordersTotal.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Последние клиенты */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Последние клиенты</h2>
          </div>
          <div className="p-6">
            {data?.recentClients && data.recentClients.length > 0 ? (
              <div className="space-y-4">
                {data.recentClients.map((client: any) => (
                  <div
                    key={client.id}
                    onClick={() => navigate(`/clients/${client.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{client.name}</p>
                      {client.company && (
                        <p className="text-sm text-gray-600">{client.company}</p>
                      )}
                      {client.email && (
                        <p className="text-sm text-gray-500">{client.email}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(client.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Нет клиентов</p>
            )}
          </div>
        </div>

        {/* Последние взаимодействия */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Последние взаимодействия</h2>
          </div>
          <div className="p-6">
            {data?.recentInteractions && data.recentInteractions.length > 0 ? (
              <div className="space-y-4">
                {data.recentInteractions.map((interaction: any) => (
                  <div
                    key={interaction.id}
                    className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                          {interaction.type}
                        </span>
                        <p className="font-medium text-gray-800">{interaction.client_name}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(interaction.interaction_date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    {interaction.description && (
                      <p className="text-sm text-gray-600">{interaction.description}</p>
                    )}
                    {interaction.creator_name && (
                      <p className="text-xs text-gray-500 mt-2">Автор: {interaction.creator_name}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Нет взаимодействий</p>
            )}
          </div>
        </div>

        {/* Топ клиенты */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Топ клиенты по сумме заказов</h2>
          </div>
          <div className="p-6">
            {data?.topClients && data.topClients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Клиент</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Компания</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Заказы</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Взаимодействия</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topClients.map((client: any) => (
                      <tr
                        key={client.id}
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-800">{client.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{client.company || '-'}</td>
                        <td className="py-3 px-4 text-sm text-center text-gray-800">{client.orders_count}</td>
                        <td className="py-3 px-4 text-sm text-center text-gray-800">{client.interactions_count}</td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-gray-800">
                          {parseFloat(client.total_amount).toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Нет данных</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
