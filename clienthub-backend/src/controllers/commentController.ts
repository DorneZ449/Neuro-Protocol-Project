import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { client_id, text } = req.body;

    if (!client_id || !text) {
      return res.status(400).json({ error: 'client_id и text обязательны' });
    }

    const result = await query(
      `INSERT INTO comments (client_id, text, created_by) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [client_id, text, req.user?.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка создания комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM comments WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Комментарий не найден' });
    }

    res.json({ message: 'Комментарий удален' });
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
