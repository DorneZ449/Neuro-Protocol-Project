import type { NextFunction, Response } from 'express';
import type { AuthRequest } from './auth';
import { query } from '../database/db';

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const result = await query('SELECT role FROM users WHERE id = $1', [req.user.id]);

    if (!result.rows[0] || result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Доступ только для администратора' });
    }

    return next();
  } catch (error) {
    console.error('Ошибка проверки роли администратора:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
};
