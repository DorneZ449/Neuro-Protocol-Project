export const ORDER_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'] as const;
export const INTERACTION_TYPES = ['call', 'email', 'meeting', 'message', 'note', 'other'] as const;
export const USER_ROLES = ['user', 'admin'] as const;

export type OrderStatus = typeof ORDER_STATUSES[number];
export type InteractionType = typeof INTERACTION_TYPES[number];
export type UserRole = typeof USER_ROLES[number];

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
