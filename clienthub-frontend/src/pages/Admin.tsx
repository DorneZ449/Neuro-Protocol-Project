import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

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
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'clients' | 'orders' | 'interactions'>('users');

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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
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
      <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Пользователи ({data.users.length})
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 rounded ${
            activeTab === 'clients' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Клиенты ({data.clients.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded ${
            activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Заказы ({data.orders.length})
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`px-4 py-2 rounded ${
            activeTab === 'interactions' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Взаимодействия ({data.interactions.length})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {activeTab === 'users' && (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Роль</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{u.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'clients' && (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Телефон</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Компания</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Теги</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{client.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {client.tags || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(client.created_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'orders' && (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сумма</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.client_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.amount} ₽</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'interactions' && (
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Заметки</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Создан</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.interactions.map((interaction) => (
                <tr key={interaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{interaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{interaction.client_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{interaction.type}</td>
                  <td className="px-6 py-4">{interaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(interaction.created_at).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Обновляется каждые 5 секунд
      </div>
    </div>
  );
}
