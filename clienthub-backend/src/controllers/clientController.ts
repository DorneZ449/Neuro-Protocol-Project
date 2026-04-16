import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const { search, tag, company, page = '1', limit = '20' } = req.query;

    // Validate and cap limit (max 100)
    const MAX_LIMIT = 100;
    let limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1) limitNum = 20;
    if (limitNum > MAX_LIMIT) limitNum = MAX_LIMIT;

    const pageNum = parseInt(page as string);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Неверный формат page' });
    }

    // Build WHERE clause with owner filter
    const isAdmin = req.user?.role === 'admin';
    const filterParams: Array<string | number> = [];
    const filters: string[] = [];

    // Owner filter - non-admins can only see their own clients
    if (!isAdmin) {
      filterParams.push(req.user!.id);
      filters.push(`c.created_by = $${filterParams.length}`);
    }

    if (search) {
      filterParams.push(`%${search}%`);
      filters.push(
        `(c.name ILIKE $${filterParams.length} OR c.email ILIKE $${filterParams.length} OR c.phone ILIKE $${filterParams.length} OR c.company ILIKE $${filterParams.length})`
      );
    }

    if (tag) {
      filterParams.push(`%${tag}%`);
      filters.push(`c.tags ILIKE $${filterParams.length}`);
    }

    if (company) {
      filterParams.push(`%${company}%`);
      filters.push(`c.company ILIKE $${filterParams.length}`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    // Run count and data queries in parallel
    const offset = (pageNum - 1) * limitNum;
    const [countResult, dataResult] = await Promise.all([
      query(
        `SELECT COUNT(*) FROM clients c ${whereClause}`,
        filterParams
      ),
      query(
        `SELECT c.*, u.name as creator_name
         FROM clients c
         LEFT JOIN users u ON c.created_by = u.id
         ${whereClause}
         ORDER BY c.created_at DESC
         LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}`,
        [...filterParams, limitNum, offset]
      )
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      clients: dataResult.rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
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

    // Validate ID
    const clientId = parseInt(id);
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    const isAdmin = req.user?.role === 'admin';

    // Check client access with owner filter
    const clientResult = await query(
      `SELECT c.*, u.name as creator_name
       FROM clients c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE c.id = $1 AND (c.created_by = $2 OR $3 = true)`,
      [clientId, req.user!.id, isAdmin]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }

    // Parallel queries for related data
    const [ordersResult, interactionsResult, commentsResult] = await Promise.all([
      query(
        'SELECT * FROM orders WHERE client_id = $1 ORDER BY order_date DESC',
        [clientId]
      ),
      query(
        `SELECT i.*, u.name as creator_name
         FROM interactions i
         LEFT JOIN users u ON i.created_by = u.id
         WHERE i.client_id = $1
         ORDER BY i.interaction_date DESC`,
        [clientId]
      ),
      query(
        `SELECT c.*, u.name as creator_name
         FROM comments c
         LEFT JOIN users u ON c.created_by = u.id
         WHERE c.client_id = $1
         ORDER BY c.created_at DESC`,
        [clientId]
      )
    ]);

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

    // Validate name length (max 255)
    if (name.length > 255) {
      return res.status(400).json({ error: 'Имя не может превышать 255 символов' });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Неверный формат email' });
      }
    }

    // Validate notes length (max 5000)
    if (notes && notes.length > 5000) {
      return res.status(400).json({ error: 'Заметки не могут превышать 5000 символов' });
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

    // Validate ID
    const clientId = parseInt(id);
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Неверный формат email' });
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

    addField('name', typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 255 ? name.trim() : name);
    addField('phone', phone);
    addField('email', typeof email === 'string' ? email.trim().toLowerCase() : email);
    addField('company', company);
    addField('tags', tags);
    addField('notes', notes && notes.length <= 5000 ? notes : notes);

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Нет полей для обновления' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    const isAdmin = req.user?.role === 'admin';
    values.push(clientId, req.user!.id, isAdmin);

    const result = await query(
      `UPDATE clients
       SET ${updates.join(', ')}
       WHERE id = $${values.length - 2}
         AND (created_by = $${values.length - 1} OR $${values.length} = true)
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден или у вас нет прав на его изменение' });
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

    // Validate ID
    const clientId = parseInt(id);
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Use role from JWT (no extra DB query needed)
    const isAdmin = req.user?.role === 'admin';

    // Delete with ownership check (admin can delete any client)
    const result = await query(
      'DELETE FROM clients WHERE id = $1 AND (created_by = $2 OR $3 = true) RETURNING *',
      [clientId, req.user?.id, isAdmin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден или у вас нет прав на его удаление' });
    }

    res.json({ message: 'Клиент удален' });
  } catch (error) {
    console.error('Ошибка удаления клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
