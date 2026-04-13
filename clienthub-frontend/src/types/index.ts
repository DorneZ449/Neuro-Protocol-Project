export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Client {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  tags?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  creator_name?: string;
}

export interface Order {
  id: number;
  client_id: number;
  title: string;
  description?: string;
  amount?: number;
  status: string;
  order_date: string;
  created_at: string;
  created_by: number;
}

export interface Interaction {
  id: number;
  client_id: number;
  type: string;
  description?: string;
  interaction_date: string;
  created_at: string;
  created_by: number;
  creator_name?: string;
}

export interface Comment {
  id: number;
  client_id: number;
  text: string;
  created_at: string;
  created_by: number;
  creator_name?: string;
}

export interface ClientDetails {
  client: Client;
  orders: Order[];
  interactions: Interaction[];
  comments: Comment[];
}
