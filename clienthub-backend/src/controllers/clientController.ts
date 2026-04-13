import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const { search, tag, company, page = '1', limit = '20' } = req.query;

    let queryText = `SELECT c.*, u.name as creator_name
                     FROM clients c
                     LEFT JOIN users u ON c.created_by = u.id
                     WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryText += ` AND (c.name ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex} OR c.phone ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (tag) {
      queryText += ` AND c.tags ILIKE $${paramIndex}`;
      params.push(`%${tag}%`);
      paramIndex++;
    }

    if (company) {
      queryText += ` AND c.company ILIKE $${paramIndex}`;
      params.push(`%${company}%`);
      paramIndex++;
    }

    const countResult = await query(queryText.replace('SELECT c.*, u.name as creator_name', 'SELECT COUNT(*)'), params);
    const total = parseInt(countResult.rows[0].count);

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    queryText += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), offset);

    const result = await query(queryText, params);

    res.json({
      clients: result.rows,
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Ошибка получения клиентов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getClientById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const clientResult = await query(
      `SELECT c.*, u.name as creator_name 
       FROM clients c 
       LEFT JOIN users u ON c.created_by = u.id 
       WHERE c.id = $1`,
      [id]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }

    const ordersResult = await query(
      'SELECT * FROM orders WHERE client_id = $1 ORDER BY order_date DESC',
      [id]
    );

    const interactionsResult = await query(
      `SELECT i.*, u.name as creator_name 
       FROM interactions i 
       LEFT JOIN users u ON i.created_by = u.id 
       WHERE i.client_id = $1 
       ORDER BY i.interaction_date DESC`,
      [id]
    );

    const commentsResult = await query(
      `SELECT c.*, u.name as creator_name 
       FROM comments c 
       LEFT JOIN users u ON c.created_by = u.id 
       WHERE c.client_id = $1 
       ORDER BY c.created_at DESC`,
      [id]
    );

    res.json({
      client: clientResult.rows[0],
      orders: ordersResult.rows,
      interactions: interactionsResult.rows,
      comments: commentsResult.rows
    });
  } catch (error) {
    console.error('Ошибка получения клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, email, company, tags, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Имя клиента обязательно' });
    }

    const result = await query(
      `INSERT INTO clients (name, phone, email, company, tags, notes, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, phone, email, company, tags, notes, req.user?.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка создания клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, email, company, tags, notes } = req.body;

    const result = await query(
      `UPDATE clients 
       SET name = $1, phone = $2, email = $3, company = $4, tags = $5, notes = $6, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $7 
       RETURNING *`,
      [name, phone, email, company, tags, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }

    res.json({ message: 'Клиент удален' });
  } catch (error) {
    console.error('Ошибка удаления клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
