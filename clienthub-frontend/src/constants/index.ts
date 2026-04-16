export const ORDER_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'] as const;
export const INTERACTION_TYPES = ['call', 'email', 'meeting', 'message', 'note', 'other'] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];
export type InteractionType = typeof INTERACTION_TYPES[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'В ожидании',
  in_progress: 'В работе',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

export const INTERACTION_TYPE_LABEL: Record<InteractionType, string> = {
  call: 'Звонок',
  email: 'Email',
  meeting: 'Встреча',
  message: 'Сообщение',
  note: 'Заметка',
  other: 'Другое',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export const INTERACTION_TYPE_COLOR: Record<InteractionType, string> = {
  meeting: 'bg-blue-500',
  call: 'bg-green-500',
  email: 'bg-yellow-500',
  message: 'bg-purple-500',
  note: 'bg-pink-500',
  other: 'bg-gray-500',
};
