import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../hooks/useCurrency';
import api from '../api/axios';
import { Toaster } from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  tags: string;
  created_at: string;
}

interface Order {
  id: number;
  client_id: number;
  amount: number;
  status: string;
  created_at: string;
}

interface Interaction {
  id: number;
  client_id: number;
  type: string;
  description: string;
  created_at: string;
}

interface AdminData {
  users: User[];
  clients: Client[];
  orders: Order[];
  interactions: Interaction[];
}

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'clients' | 'orders' | 'interactions'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = data?.users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Ошибка загрузки данных</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Админ-панель</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-[var(--primary-contrast)] rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Загрузка...' : 'Обновить'}
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'users' ? 'bg-blue-600 text-[var(--primary-contrast)]' : 'bg-[var(--surface-hover)]'
          }`}
        >
          Пользователи ({data.users.length})
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'clients' ? 'bg-blue-600 text-[var(--primary-contrast)]' : 'bg-[var(--surface-hover)]'
          }`}
        >
          Клиенты ({data.clients.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-blue-600 text-[var(--primary-contrast)]' : 'bg-[var(--surface-hover)]'
          }`}
        >
          Заказы ({data.orders.length})
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'interactions' ? 'bg-blue-600 text-[var(--primary-contrast)]' : 'bg-[var(--surface-hover)]'
          }`}
        >
          Взаимодействия ({data.interactions.length})
        </button>
      </div>

      <div className="surface rounded-lg shadow overflow-x-auto">
        {activeTab === 'users' && (
          <table className="min-w-[800px]">
            <thead className="bg-[var(--surface-hover)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Имя</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Роль</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-4 whitespace-nowrap">{u.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{u.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{u.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      u.role === 'admin' ? 'bg-[var(--info-bg)] text-[var(--info-text)]' : 'bg-gray-100 text-app'
                    }`}>
                      {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'clients' && (
          <table className="min-w-[900px]">
            <thead className="bg-[var(--surface-hover)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Имя</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Телефон</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Компания</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Теги</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-4 py-4 whitespace-nowrap">{client.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{client.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{client.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{client.phone}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{client.company}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {client.tags || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(client.created_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'orders' && (
          <table className="min-w-[700px]">
            <thead className="bg-[var(--surface-hover)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Client ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Сумма</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Статус</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{order.client_id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{format(order.amount)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'completed' ? 'bg-[var(--success-bg)] text-[var(--success-text)]' :
                      order.status === 'pending' ? 'bg-[var(--warning-bg)] text-[var(--warning-text)]' :
                      'bg-[var(--danger-bg)] text-[var(--danger-text)]'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'interactions' && (
          <table className="min-w-[800px]">
            <thead className="bg-[var(--surface-hover)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Client ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Тип</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Заметки</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase whitespace-nowrap">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.interactions.map((interaction) => (
                <tr key={interaction.id}>
                  <td className="px-4 py-4 whitespace-nowrap">{interaction.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{interaction.client_id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{interaction.type}</td>
                  <td className="px-4 py-4">{interaction.description}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {new Date(interaction.created_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
