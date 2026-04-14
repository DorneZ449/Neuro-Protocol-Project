import type { Request, Response } from 'express';
import pool from '../database/db';

export const getAllData = async (req: Request, res: Response) => {
  try {
    const usersResult = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC');
    const clientsResult = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    const ordersResult = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const interactionsResult = await pool.query('SELECT * FROM interactions ORDER BY created_at DESC');

    res.json({
      users: usersResult.rows,
      clients: clientsResult.rows,
      orders: ordersResult.rows,
      interactions: interactionsResult.rows
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
