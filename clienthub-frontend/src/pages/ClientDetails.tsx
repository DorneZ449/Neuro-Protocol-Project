import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../api/clients';
import { orderAPI, interactionAPI, commentAPI } from '../api/index';
import { useCurrency } from '../hooks/useCurrency';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const [activeTab, setActiveTab] = useState<'orders' | 'interactions' | 'comments'>('orders');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCreatingInteraction, setIsCreatingInteraction] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);

  const [orderForm, setOrderForm] = useState({
    title: '',
    description: '',
    amount: '',
    status: 'pending',
  });

  const [interactionForm, setInteractionForm] = useState({
    type: 'call',
    description: '',
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientAPI.getById(Number(id)),
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrder(true);
    try {
      await orderAPI.create({
        client_id: Number(id),
        ...orderForm,
        amount: orderForm.amount ? Number(orderForm.amount) : undefined,
      });
      setShowOrderModal(false);
      setOrderForm({ title: '', description: '', amount: '', status: 'pending' });
      refetch();
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
      alert('Ошибка при создании заказа');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCreateInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingInteraction(true);
    try {
      await interactionAPI.create({
        client_id: Number(id),
        ...interactionForm,
      });
      setShowInteractionModal(false);
      setInteractionForm({ type: 'call', description: '' });
      refetch();
    } catch (error) {
      console.error('Ошибка создания взаимодействия:', error);
      alert('Ошибка при создании взаимодействия');
    } finally {
      setIsCreatingInteraction(false);
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsCreatingComment(true);
    try {
      await commentAPI.create({
        client_id: Number(id),
        text: commentText,
      });
      setCommentText('');
      refetch();
    } catch (error) {
      console.error('Ошибка создания комментария:', error);
      alert('Ошибка при создании комментария');
    } finally {
      setIsCreatingComment(false);
    }
  };

  const handleDeleteClient = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента? Все связанные данные будут удалены.')) {
      setIsDeletingClient(true);
      try {
        await clientAPI.delete(Number(id));
        navigate('/clients');
      } catch (error) {
        console.error('Ошибка удаления клиента:', error);
        alert('Ошибка при удалении клиента');
      } finally {
        setIsDeletingClient(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Клиент не найден</h2>
          <p className="text-gray-600 mb-4">Возможно, клиент был удалён</p>
          <button
            onClick={() => navigate('/clients')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Вернуться к списку клиентов
          </button>
        </div>
      </div>
    );
  }

  const { client, orders, interactions, comments } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершён';
      case 'pending':
        return 'В ожидании';
      case 'cancelled':
        return 'Отменён';
      default:
        return status;
    }
  };

  const getInteractionTypeText = (type: string) => {
    switch (type) {
      case 'call':
        return 'Звонок';
      case 'email':
        return 'Email';
      case 'meeting':
        return 'Встреча';
      case 'message':
        return 'Сообщение';
      default:
        return type;
    }
  };

  const totalOrdersAmount = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button
        onClick={() => navigate('/clients')}
        className="mb-6 flex items-center gap-2 py-2 px-3 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад к списку
      </button>

      {/* Карточка клиента */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-2xl">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{client.name}</h1>
                {client.company && (
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {client.company}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {client.phone && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{client.email}</span>
                </div>
              )}
            </div>

            {client.tags && (
              <div className="mb-4">
                <span className="inline-block bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-full font-medium">
                  {client.tags}
                </span>
              </div>
            )}

            {client.notes && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">Заметки:</p>
                <p className="text-gray-600">{client.notes}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Сумма заказов</p>
              <p className="text-2xl font-bold text-blue-600">
                {format(totalOrdersAmount)}
              </p>
            </div>
            <button
              onClick={handleDeleteClient}
              disabled={isDeletingClient}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeletingClient ? 'Удаление...' : 'Удалить клиента'}
            </button>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-4 font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'orders'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Заказы ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-4 font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'interactions'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Взаимодействия ({interactions.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-4 font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'comments'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Комментарии ({comments.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'orders' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Заказы</h2>
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  + Добавить заказ
                </button>
              </div>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-500">Заказов пока нет</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800 mb-2">{order.title}</h3>
                          {order.description && (
                            <p className="text-gray-600 text-sm mb-3">{order.description}</p>
                          )}
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(order.order_date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          {order.amount && (
                            <p className="text-xl font-bold text-gray-800 mb-2">
                              {format(order.amount)}
                            </p>
                          )}
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'interactions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Взаимодействия</h2>
                <button
                  onClick={() => setShowInteractionModal(true)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  + Добавить взаимодействие
                </button>
              </div>
              <div className="space-y-4">
                {interactions.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500">Взаимодействий пока нет</p>
                  </div>
                ) : (
                  interactions.map((interaction) => (
                    <div key={interaction.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {getInteractionTypeText(interaction.type)}
                            </span>
                            <p className="text-sm text-gray-500">
                              {new Date(interaction.interaction_date).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          {interaction.description && (
                            <p className="text-gray-700 mb-2">{interaction.description}</p>
                          )}
                          {interaction.creator_name && (
                            <p className="text-xs text-gray-500">
                              Автор: {interaction.creator_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Комментарии</h2>
              <form onSubmit={handleCreateComment} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Добавить комментарий..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || isCreatingComment}
                  className="mt-3 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isCreatingComment ? 'Добавление...' : 'Добавить комментарий'}
                </button>
              </form>
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <p className="text-gray-500">Комментариев пока нет</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <p className="text-gray-800 mb-3">{comment.text}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">{comment.creator_name}</span>
                        <span className="text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальные окна */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Новый заказ</h2>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orderForm.title}
                  onChange={(e) => setOrderForm({ ...orderForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={orderForm.description}
                  onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сумма (₽)
                </label>
                <input
                  type="number"
                  value={orderForm.amount}
                  onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Статус
                </label>
                <select
                  value={orderForm.status}
                  onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">В ожидании</option>
                  <option value="completed">Завершён</option>
                  <option value="cancelled">Отменён</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingOrder ? 'Создание...' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  disabled={isCreatingOrder}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInteractionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Новое взаимодействие</h2>
            </div>
            <form onSubmit={handleCreateInteraction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип <span className="text-red-500">*</span>
                </label>
                <select
                  value={interactionForm.type}
                  onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="call">Звонок</option>
                  <option value="email">Email</option>
                  <option value="meeting">Встреча</option>
                  <option value="message">Сообщение</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  value={interactionForm.description}
                  onChange={(e) => setInteractionForm({ ...interactionForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Опишите детали взаимодействия..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreatingInteraction}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingInteraction ? 'Создание...' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInteractionModal(false)}
                  disabled={isCreatingInteraction}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
