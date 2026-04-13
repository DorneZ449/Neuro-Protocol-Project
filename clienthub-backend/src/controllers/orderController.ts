import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { client_id, title, description, amount, status, order_date } = req.body;

    if (!client_id || !title) {
      return res.status(400).json({ error: 'client_id и title обязательны' });
    }

    const result = await query(
      `INSERT INTO orders (client_id, title, description, amount, status, order_date, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [client_id, title, description, amount, status || 'pending', order_date || new Date(), req.user?.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const updateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, amount, status } = req.body;

    const result = await query(
      `UPDATE orders 
       SET title = $1, description = $2, amount = $3, status = $4 
       WHERE id = $5 
       RETURNING *`,
      [title, description, amount, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден' });
    }

    res.json({ message: 'Заказ удален' });
  } catch (error) {
    console.error('Ошибка удаления заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
