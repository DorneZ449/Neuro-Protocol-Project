import { query } from '../database/db';

export async function ensureClientAccess(
  clientId: number,
  userId: number,
  isAdmin: boolean
): Promise<boolean> {
  const result = await query(
    isAdmin
      ? 'SELECT id FROM clients WHERE id = $1'
      : 'SELECT id FROM clients WHERE id = $1 AND created_by = $2',
    isAdmin ? [clientId] : [clientId, userId]
  );

  return result.rows.length > 0;
}
