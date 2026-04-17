import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { clientAPI } from '../api/clients';
import { orderAPI, interactionAPI, commentAPI } from '../api/index';
import { useCurrency } from '../hooks/useCurrency';
import ConfirmDialog from '../components/ConfirmDialog';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { format } = useCurrency();
  const clientId = Number(id);
  const [activeTab, setActiveTab] = useState<'orders' | 'interactions' | 'comments'>('orders');
  
  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [editingInteraction, setEditingInteraction] = useState<any>(null);
  const [editingComment, setEditingComment] = useState<any>(null);
  
  // States
  const [commentText, setCommentText] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isCreatingInteraction, setIsCreatingInteraction] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [actionError, setActionError] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;

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

  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    tags: '',
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientAPI.getById(clientId),
    enabled: Number.isFinite(clientId) && clientId > 0,
  });

  if (!Number.isFinite(clientId) || clientId <= 0) {
    return <div className="card p-6">Некорректный ID клиента</div>;
  }

  if (isError) {
    return <div className="card p-6">Не удалось загрузить данные клиента</div>;
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrder(true);
    try {
      if (editingOrder) {
        // Редактирование существующего заказа
        await orderAPI.update(editingOrder.id, {
          ...orderForm,
          amount: orderForm.amount ? Number(orderForm.amount) : undefined,
        });
      } else {
        // Создание нового заказа
        await orderAPI.create({
          client_id: clientId,
          ...orderForm,
          amount: orderForm.amount ? Number(orderForm.amount) : undefined,
        });
      }
      setShowOrderModal(false);
      setOrderForm({ title: '', description: '', amount: '', status: 'pending' });
      setEditingOrder(null);
      refetch();
    } catch (error) {
      console.error('Ошибка при работе с заказом:', error);
      setActionError(getErrorMessage(error, 'Ошибка при работе с заказом'));
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder(order);
    setOrderForm({
      title: order.title || '',
      description: order.description || '',
      amount: order.amount ? String(order.amount) : '',
      status: order.status || 'pending',
    });
    setShowOrderModal(true);
  };

  const handleCreateInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingInteraction(true);
    try {
      if (editingInteraction) {
        // Редактирование существующего взаимодействия
        await interactionAPI.update(editingInteraction.id, interactionForm);
      } else {
        // Создание нового взаимодействия
        await interactionAPI.create({
          client_id: clientId,
          ...interactionForm,
        });
      }
      setShowInteractionModal(false);
      setInteractionForm({ type: 'call', description: '' });
      setEditingInteraction(null);
      refetch();
    } catch (error) {
      console.error('Ошибка при работе с взаимодействием:', error);
      setActionError(getErrorMessage(error, 'Ошибка при работе с взаимодействием'));
    } finally {
      setIsCreatingInteraction(false);
    }
  };

  const handleEditInteraction = (interaction: any) => {
    setEditingInteraction(interaction);
    setInteractionForm({
      type: interaction.type || 'call',
      description: interaction.description || '',
    });
    setShowInteractionModal(true);
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsCreatingComment(true);
    try {
      if (editingComment) {
        // Редактирование существующего комментария
        await commentAPI.update(editingComment.id, { text: commentText });
      } else {
        // Создание нового комментария
        await commentAPI.create({
          client_id: clientId,
          text: commentText,
        });
      }
      setCommentText('');
      setEditingComment(null);
      refetch();
    } catch (error) {
      console.error('Ошибка при работе с комментарием:', error);
      setActionError(getErrorMessage(error, 'Ошибка при работе с комментарием'));
    } finally {
      setIsCreatingComment(false);
    }
  };

  const handleEditComment = (comment: any) => {
    setEditingComment(comment);
    setCommentText(comment.text || '');
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await clientAPI.update(clientId, clientForm);
      setShowEditClientModal(false);
      refetch();
    } catch (error) {
      console.error('Ошибка обновления клиента:', error);
      setActionError(getErrorMessage(error, 'Ошибка при обновлении клиента'));
    }
  };

  const handleEditClient = (client: any) => {
    setClientForm({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      tags: client.tags || '',
    });
    setShowEditClientModal(true);
  };

  const handleDeleteClient = async () => {
    setIsDeletingClient(true);

    try {
      await clientAPI.delete(clientId);
      navigate('/clients');
    } catch (error) {
      console.error('Ошибка удаления клиента:', error);
      setActionError(getErrorMessage(error, 'Ошибка при удалении клиента'));
    } finally {
      setIsDeletingClient(false);
      setConfirmDeleteOpen(false);
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
        <div className="surface rounded-xl shadow-sm border border-app p-12 text-center">
          <h2 className="text-2xl font-bold text-app mb-2">Клиент не найден</h2>
          <p className="text-muted mb-4">Возможно, клиент был удалён</p>
          <button
            onClick={() => navigate('/clients')}
            className="text-blue-600 hover:text-[var(--info-text)] font-medium"
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
        return 'bg-[var(--success-bg)] text-[var(--success-text)]';
      case 'in_progress':
        return 'bg-[var(--primary-bg)] text-[var(--info-text)]';
      case 'pending':
        return 'bg-[var(--warning-bg)] text-[var(--warning-text)]';
      case 'cancelled':
        return 'bg-[var(--danger-bg)] text-[var(--danger-text)]';
      default:
        return 'surface border border-app text-app';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершён';
      case 'in_progress':
        return 'В работе';
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
      case 'note':
        return 'Заметка';
      case 'other':
        return 'Другое';
      default:
        return type;
    }
  };

  const totalOrdersAmount = orders.reduce((sum, order) => {
    const amount = typeof order.amount === 'string' ? parseFloat(order.amount) : order.amount;
    return sum + (amount || 0);
  }, 0);

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {actionError && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-[var(--danger-text)]">
          {actionError}
        </div>
      )}

      <button
        onClick={() => navigate('/clients')}
        className="mb-6 flex items-center gap-2 py-2 px-3 text-muted hover:text-app rounded-lg hover:bg-[var(--surface-hover)] transition-colors min-h-[44px]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Назад к списку
      </button>

      {/* Карточка клиента */}
      <div className="surface rounded-xl shadow-sm border border-app p-4 sm:p-8 mb-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handleEditClient(client)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-[var(--primary-bg)] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Редактировать
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-[var(--primary-bg)] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-2xl">
                  {client.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-app mb-2 break-words">{client.name}</h1>
                {client.company && (
                  <p className="text-sm sm:text-base md:text-lg text-muted flex items-center gap-2 break-words">
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
                <div className="flex items-center gap-3 p-3 bg-[var(--surface-hover)] rounded-lg min-w-0">
                  <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-app text-sm sm:text-base break-all">{client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-3 p-3 bg-[var(--surface-hover)] rounded-lg min-w-0">
                  <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-app text-sm sm:text-base break-all">{client.email}</span>
                </div>
              )}
            </div>

            {client.tags && (
              <div className="mb-4">
                <span className="inline-block bg-[var(--primary-bg)] text-[var(--info-text)] text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full font-medium break-words max-w-full">
                  {client.tags}
                </span>
              </div>
            )}

            {client.notes && (
              <div className="p-3 sm:p-4 bg-[var(--surface-hover)] rounded-lg border border-app">
                <p className="text-xs sm:text-sm font-medium text-app mb-1">Заметки:</p>
                <p className="text-muted text-sm break-words">{client.notes}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="bg-[var(--primary-bg)] rounded-lg p-3 sm:p-4 text-center">
              <p className="text-xs sm:text-sm text-muted mb-1">Сумма заказов</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 break-words">
                {format(totalOrdersAmount)}
              </p>
            </div>
            <button
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={isDeletingClient}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-[var(--danger-bg)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeletingClient ? 'Удаление...' : 'Удалить клиента'}
            </button>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="surface rounded-xl shadow-sm border border-app">
        <div className="border-b border-app">
          <div className="flex flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-4 font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'orders'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-[var(--primary-bg)]'
                  : 'text-muted hover:text-app hover:bg-[var(--surface-hover)]'
              }`}
            >
              Заказы ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-4 font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'interactions'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-[var(--primary-bg)]'
                  : 'text-muted hover:text-app hover:bg-[var(--surface-hover)]'
              }`}
            >
              Взаимодействия ({interactions.length})
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-4 font-medium text-sm sm:text-base transition-colors ${
                activeTab === 'comments'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-[var(--primary-bg)]'
                  : 'text-muted hover:text-app hover:bg-[var(--surface-hover)]'
              }`}
            >
              Комментарии ({comments.length})
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          {activeTab === 'orders' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-app">Заказы</h2>
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="w-full sm:w-auto bg-blue-600 text-[var(--primary-contrast)] px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm sm:text-base"
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
                    <p className="text-muted">Заказов пока нет</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border border-app rounded-lg p-3 sm:p-5 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div className="flex-1 min-w-0 w-full">
                          <h3 className="font-semibold text-base sm:text-lg text-app mb-2 break-words">{order.title}</h3>
                          {order.description && (
                            <p className="text-muted text-sm mb-3 break-words">{order.description}</p>
                          )}
                          <p className="text-xs sm:text-sm text-muted flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(order.order_date).toLocaleDateString('ru-RU')}
                          </p>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-0 w-full sm:w-auto sm:text-right">
                          {order.amount && (
                            <p className="text-base sm:text-xl font-bold text-app mb-0 sm:mb-2 break-words">
                              {format(order.amount)}
                            </p>
                          )}
                          <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="mt-0 sm:mt-2 flex items-center gap-1 text-blue-600 hover:text-[var(--info-text)] text-xs sm:text-sm whitespace-nowrap"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Редактировать
                          </button>
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
                <h2 className="text-xl font-semibold text-app">Взаимодействия</h2>
                <button
                  onClick={() => setShowInteractionModal(true)}
                  className="bg-blue-600 text-[var(--primary-contrast)] px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
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
                    <p className="text-muted">Взаимодействий пока нет</p>
                  </div>
                ) : (
                  interactions.map((interaction) => (
                    <div key={interaction.id} className="border border-app rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[var(--info-bg)] rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <span className="px-3 py-1 bg-[var(--info-bg)] text-[var(--info-text)] rounded-full text-sm font-medium">
                              {getInteractionTypeText(interaction.type)}
                            </span>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted">
                                {new Date(interaction.interaction_date).toLocaleDateString('ru-RU')}
                              </p>
                              <button
                                onClick={() => handleEditInteraction(interaction)}
                                className="text-blue-600 hover:text-[var(--info-text)]"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {interaction.description && (
                            <p className="text-app mb-2">{interaction.description}</p>
                          )}
                          {interaction.creator_name && (
                            <p className="text-xs text-muted">
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
              <h2 className="text-xl font-semibold text-app mb-6">Комментарии</h2>
              <form onSubmit={handleCreateComment} className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={editingComment ? "Редактировать комментарий..." : "Добавить комментарий..."}
                  className="w-full px-4 py-3 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    disabled={!commentText.trim() || isCreatingComment}
                    className="bg-blue-600 text-[var(--primary-contrast)] px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isCreatingComment ? 'Сохранение...' : editingComment ? 'Сохранить' : 'Добавить комментарий'}
                  </button>
                  {editingComment && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingComment(null);
                        setCommentText('');
                      }}
                      className="px-6 py-2.5 rounded-lg border border-app hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      Отмена
                    </button>
                  )}
                </div>
              </form>
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <p className="text-muted">Комментариев пока нет</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="border border-app rounded-lg p-5 hover:shadow-md transition-shadow">
                      <p className="text-app mb-3">{comment.text}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted font-medium">{comment.creator_name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-muted">
                            {new Date(comment.created_at).toLocaleDateString('ru-RU')}
                          </span>
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-blue-600 hover:text-[var(--info-text)]"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
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
          <div className="surface rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-app">
              <h2 className="text-2xl font-bold text-app">
                {editingOrder ? 'Редактировать заказ' : 'Новый заказ'}
              </h2>
            </div>
            <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Название <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orderForm.title}
                  onChange={(e) => setOrderForm({ ...orderForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Описание
                </label>
                <textarea
                  value={orderForm.description}
                  onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Сумма (₽)
                </label>
                <input
                  type="number"
                  value={orderForm.amount}
                  onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Статус
                </label>
                <select
                  value={orderForm.status}
                  onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">В ожидании</option>
                  <option value="in_progress">В работе</option>
                  <option value="completed">Завершён</option>
                  <option value="cancelled">Отменён</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="flex-1 bg-blue-600 text-[var(--primary-contrast)] py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingOrder ? 'Сохранение...' : editingOrder ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOrderModal(false);
                    setEditingOrder(null);
                    setOrderForm({ title: '', description: '', amount: '', status: 'pending' });
                  }}
                  disabled={isCreatingOrder}
                  className="flex-1 surface border border-app text-app py-2.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors font-medium disabled:opacity-50"
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
          <div className="surface rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-app">
              <h2 className="text-2xl font-bold text-app">
                {editingInteraction ? 'Редактировать взаимодействие' : 'Новое взаимодействие'}
              </h2>
            </div>
            <form onSubmit={handleCreateInteraction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Тип <span className="text-red-500">*</span>
                </label>
                <select
                  value={interactionForm.type}
                  onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="call">Звонок</option>
                  <option value="email">Email</option>
                  <option value="meeting">Встреча</option>
                  <option value="message">Сообщение</option>
                  <option value="note">Заметка</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Описание
                </label>
                <textarea
                  value={interactionForm.description}
                  onChange={(e) => setInteractionForm({ ...interactionForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Опишите детали взаимодействия..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreatingInteraction}
                  className="flex-1 bg-blue-600 text-[var(--primary-contrast)] py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingInteraction ? 'Сохранение...' : editingInteraction ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInteractionModal(false);
                    setEditingInteraction(null);
                    setInteractionForm({ type: 'call', description: '' });
                  }}
                  disabled={isCreatingInteraction}
                  className="flex-1 surface border border-app text-app py-2.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors font-medium disabled:opacity-50"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования клиента */}
      {showEditClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="surface rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-app">
              <h2 className="text-2xl font-bold text-app">Редактировать клиента</h2>
            </div>
            <form onSubmit={handleUpdateClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Компания
                </label>
                <input
                  type="text"
                  value={clientForm.company}
                  onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-app mb-2">
                  Теги
                </label>
                <input
                  type="text"
                  value={clientForm.tags}
                  onChange={(e) => setClientForm({ ...clientForm, tags: e.target.value })}
                  className="w-full px-4 py-2.5 border border-app rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="VIP, Постоянный клиент"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-[var(--primary-contrast)] py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditClientModal(false)}
                  className="flex-1 surface border border-app text-app py-2.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors font-medium"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Удалить клиента?"
        description="Клиент и связанные данные будут удалены без возможности восстановления."
        confirmLabel="Удалить"
        busy={isDeletingClient}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteClient}
      />
    </div>
  );
};

export default ClientDetails;
