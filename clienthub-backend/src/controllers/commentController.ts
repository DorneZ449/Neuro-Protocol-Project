import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';
import { ensureClientAccess } from '../utils/ensureClientAccess';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { client_id, text } = req.body;

    if (!client_id || !text) {
      return res.status(400).json({ error: 'client_id и text обязательны' });
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

    // Validate text length (max 2000 chars)
    if (text.length > 2000) {
      return res.status(400).json({ error: 'Текст комментария не может превышать 2000 символов' });
    }

    const result = await query(
      `INSERT INTO comments (client_id, text, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [clientIdNum, text, req.user?.id]
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

    // Validate ID
    const commentId = parseInt(id);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Check if user is admin
    const isAdmin = req.user?.role === 'admin';

    // Delete with ownership check (admin can delete any comment)
    const result = await query(
      'DELETE FROM comments WHERE id = $1 AND (created_by = $2 OR $3 = true) RETURNING *',
      [commentId, req.user?.id, isAdmin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Комментарий не найден или у вас нет прав на его удаление' });
    }

    res.json({ message: 'Комментарий удален' });
  } catch (error) {
    console.error('Ошибка удаления комментария:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

