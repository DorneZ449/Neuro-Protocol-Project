import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const clientsCount = await query('SELECT COUNT(*) as count FROM clients');

    const ordersCount = await query('SELECT COUNT(*) as count FROM orders');

    const interactionsCount = await query('SELECT COUNT(*) as count FROM interactions');

    const ordersTotal = await query('SELECT COALESCE(SUM(amount), 0) as total FROM orders');

    const recentClients = await query(
      `SELECT c.*, u.name as creator_name
       FROM clients c
       LEFT JOIN users u ON c.created_by = u.id
       ORDER BY c.created_at DESC
       LIMIT 5`
    );

    const recentInteractions = await query(
      `SELECT i.*, c.name as client_name, u.name as creator_name
       FROM interactions i
       LEFT JOIN clients c ON i.client_id = c.id
       LEFT JOIN users u ON i.created_by = u.id
       ORDER BY i.interaction_date DESC
       LIMIT 5`
    );

    const topClients = await query(
      `SELECT c.id, c.name, c.company,
              COUNT(DISTINCT o.id) as orders_count,
              COUNT(DISTINCT i.id) as interactions_count,
              COALESCE(SUM(o.amount), 0) as total_amount
       FROM clients c
       LEFT JOIN orders o ON c.id = o.client_id
       LEFT JOIN interactions i ON c.id = i.client_id
       GROUP BY c.id, c.name, c.company
       ORDER BY total_amount DESC
       LIMIT 5`
    );

    res.json({
      stats: {
        clientsCount: parseInt(clientsCount.rows[0].count),
        ordersCount: parseInt(ordersCount.rows[0].count),
        interactionsCount: parseInt(interactionsCount.rows[0].count),
        ordersTotal: parseFloat(ordersTotal.rows[0].total)
      },
      recentClients: recentClients.rows,
      recentInteractions: recentInteractions.rows,
      topClients: topClients.rows
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
