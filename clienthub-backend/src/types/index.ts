export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: Date;
}

export interface Client {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  tags?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  created_by: number;
}

export interface Order {
  id: number;
  client_id: number;
  title: string;
  description?: string;
  amount?: number;
  status: string;
  order_date: Date;
  created_at: Date;
  created_by: number;
}

export interface Interaction {
  id: number;
  client_id: number;
  type: string;
  description?: string;
  interaction_date: Date;
  created_at: Date;
  created_by: number;
}

export interface Comment {
  id: number;
  client_id: number;
  text: string;
  created_at: Date;
  created_by: number;
}
