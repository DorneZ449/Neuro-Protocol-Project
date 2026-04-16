import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === 'admin';
    const params = isAdmin ? [] : [req.user!.id];
    const clientWhere = isAdmin ? '' : 'WHERE c.created_by = $1';

    const [
      clientsCount,
      ordersCount,
      interactionsCount,
      ordersTotal,
      recentClients,
      recentInteractions,
      topClients,
    ] = await Promise.all([
      query(
        `SELECT COUNT(*) AS count
         FROM clients c
         ${clientWhere}`,
        params
      ),
      query(
        `SELECT COUNT(*) AS count
         FROM orders o
         JOIN clients c ON c.id = o.client_id
         ${clientWhere}`,
        params
      ),
      query(
        `SELECT COUNT(*) AS count
         FROM interactions i
         JOIN clients c ON c.id = i.client_id
         ${clientWhere}`,
        params
      ),
      query(
        `SELECT COALESCE(SUM(o.amount), 0) AS total
         FROM orders o
         JOIN clients c ON c.id = o.client_id
         ${clientWhere}`,
        params
      ),
      query(
        `SELECT c.*, u.name AS creator_name
         FROM clients c
         LEFT JOIN users u ON c.created_by = u.id
         ${clientWhere}
         ORDER BY c.created_at DESC
         LIMIT 5`,
        params
      ),
      query(
        `SELECT i.*, c.name AS client_name, u.name AS creator_name
         FROM interactions i
         JOIN clients c ON c.id = i.client_id
         LEFT JOIN users u ON u.id = i.created_by
         ${clientWhere}
         ORDER BY i.interaction_date DESC
         LIMIT 5`,
        params
      ),
      query(
        `SELECT c.id, c.name, c.company,
                COALESCE(o.orders_count, 0) AS orders_count,
                COALESCE(i.interactions_count, 0) AS interactions_count,
                COALESCE(o.total_amount, 0) AS total_amount
         FROM clients c
         LEFT JOIN (
           SELECT client_id,
                  COUNT(*) AS orders_count,
                  COALESCE(SUM(amount), 0) AS total_amount
           FROM orders
           GROUP BY client_id
         ) o ON o.client_id = c.id
         LEFT JOIN (
           SELECT client_id,
                  COUNT(*) AS interactions_count
           FROM interactions
           GROUP BY client_id
         ) i ON i.client_id = c.id
         ${clientWhere}
         ORDER BY total_amount DESC
         LIMIT 5`,
        params
      ),
    ]);

    return res.json({
      stats: {
        clientsCount: Number(clientsCount.rows[0].count),
        ordersCount: Number(ordersCount.rows[0].count),
        interactionsCount: Number(interactionsCount.rows[0].count),
        ordersTotal: Number(ordersTotal.rows[0].total),
      },
      recentClients: recentClients.rows,
      recentInteractions: recentInteractions.rows,
      topClients: topClients.rows,
    });
  } catch (error) {
    console.error('Ошибка получения dashboard:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
};
