import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';
import { ensureClientAccess } from '../utils/ensureClientAccess';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { client_id, title, description, amount, status, order_date } = req.body;

    if (!client_id || !title) {
      return res.status(400).json({ error: 'client_id и title обязательны' });
    }

    // Validate client_id is a number
    const clientIdNum = parseInt(client_id);
    if (isNaN(clientIdNum)) {
      return res.status(400).json({ error: 'Неверный формат client_id' });
    }

    // Check client access
    const isAdmin = req.user?.role === 'admin';
    if (!(await ensureClientAccess(clientIdNum, req.user!.id, isAdmin))) {
      return res.status(404).json({ error: 'Клиент не найден или нет доступа' });
    }

    // Validate title length (max 255)
    if (title.length > 255) {
      return res.status(400).json({ error: 'Название не может превышать 255 символов' });
    }

    // Validate description length (max 2000)
    if (description && description.length > 2000) {
      return res.status(400).json({ error: 'Описание не может превышать 2000 символов' });
    }

    // Validate amount
    if (amount !== undefined && (typeof amount !== 'number' || isNaN(amount) || amount < 0)) {
      return res.status(400).json({ error: 'Сумма должна быть числом не меньше 0' });
    }

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    const orderStatus = status || 'pending';
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: `Статус должен быть одним из: ${validStatuses.join(', ')}` });
    }

    const result = await query(
      `INSERT INTO orders (client_id, title, description, amount, status, order_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [clientIdNum, title, description, amount, orderStatus, order_date || new Date(), req.user?.id]
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

    // Validate ID
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Validate amount
    if (amount !== undefined && (typeof amount !== 'number' || isNaN(amount) || amount < 0)) {
      return res.status(400).json({ error: 'Сумма должна быть числом не меньше 0' });
    }

    // Validate status
    if (status) {
      const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Статус должен быть одним из: ${validStatuses.join(', ')}` });
      }
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: unknown[] = [];

    const addField = (column: string, value: unknown) => {
      if (value !== undefined) {
        values.push(value);
        updates.push(`${column} = $${values.length}`);
      }
    };

    addField('title', typeof title === 'string' && title.trim().length > 0 && title.trim().length <= 255 ? title.trim() : title);
    addField('description', description && description.length <= 2000 ? description : description);
    addField('amount', amount);
    addField('status', status);

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Нет полей для обновления' });
    }

    const isAdmin = req.user?.role === 'admin';
    values.push(orderId, req.user!.id, isAdmin);

    const result = await query(
      `UPDATE orders
       SET ${updates.join(', ')}
       WHERE id = $${values.length - 2}
         AND (created_by = $${values.length - 1} OR $${values.length} = true)
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден или у вас нет прав на его изменение' });
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

    // Validate ID
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Use role from JWT (no extra DB query needed)
    const isAdmin = req.user?.role === 'admin';

    // Delete with ownership check (admin can delete any order)
    const result = await query(
      'DELETE FROM orders WHERE id = $1 AND (created_by = $2 OR $3 = true) RETURNING *',
      [orderId, req.user?.id, isAdmin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Заказ не найден или у вас нет прав на его удаление' });
    }

    res.json({ message: 'Заказ удален' });
  } catch (error) {
    console.error('Ошибка удаления заказа:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

