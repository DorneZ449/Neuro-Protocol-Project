import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const createInteraction = async (req: AuthRequest, res: Response) => {
  try {
    const { client_id, type, description, interaction_date } = req.body;

    if (!client_id || !type) {
      return res.status(400).json({ error: 'client_id и type обязательны' });
    }

    const result = await query(
      `INSERT INTO interactions (client_id, type, description, interaction_date, created_by) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [client_id, type, description, interaction_date || new Date(), req.user?.id]
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
    const result = await query('DELETE FROM interactions WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Взаимодействие не найдено' });
    }

    res.json({ message: 'Взаимодействие удалено' });
  } catch (error) {
    console.error('Ошибка удаления взаимодействия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
