import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const getInteractions = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT i.*, c.name as client_name, u.name as creator_name
       FROM interactions i
       LEFT JOIN clients c ON i.client_id = c.id
       LEFT JOIN users u ON i.created_by = u.id
       ORDER BY i.interaction_date DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения взаимодействий:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const createInteraction = async (req: AuthRequest, res: Response) => {
  try {
    const { client_id, type, description, interaction_date } = req.body;

    if (!client_id || !type) {
      return res.status(400).json({ error: 'client_id и type обязательны' });
    }

    // Validate client_id is a number
    const clientIdNum = parseInt(client_id);
    if (isNaN(clientIdNum)) {
      return res.status(400).json({ error: 'Неверный формат client_id' });
    }

    // Validate interaction type
    const validTypes = ['call', 'email', 'meeting', 'note', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `Тип должен быть одним из: ${validTypes.join(', ')}` });
    }

    // Validate description length (max 2000 chars)
    if (description && description.length > 2000) {
      return res.status(400).json({ error: 'Описание не может превышать 2000 символов' });
    }

    const result = await query(
      `INSERT INTO interactions (client_id, type, description, interaction_date, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [clientIdNum, type, description, interaction_date || new Date(), req.user?.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка создания взаимодействия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const deleteInteraction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID
    const interactionId = parseInt(id);
    if (isNaN(interactionId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Check if user is admin
    const isAdmin = req.user?.role === 'admin';

    // Delete with ownership check (admin can delete any interaction)
    const result = await query(
      'DELETE FROM interactions WHERE id = $1 AND (created_by = $2 OR $3 = true) RETURNING *',
      [interactionId, req.user?.id, isAdmin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Взаимодействие не найдено или у вас нет прав на его удаление' });
    }

    res.json({ message: 'Взаимодействие удалено' });
  } catch (error) {
    console.error('Ошибка удаления взаимодействия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
