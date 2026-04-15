import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://clienthub_6kyv_user:I95ej0rBcX0A3u1cEPpwj8zOXLJ3YSqn@dpg-d7ekae6rnols73ei2vr0-a.frankfurt-postgres.render.com/clienthub_6kyv',
  ssl: { rejectUnauthorized: false }
});

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Укажите email: node make-admin-by-email.js user@example.com');
    process.exit(1);
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, email, name, role',
      ['admin', email]
    );

    if (result.rows.length === 0) {
      console.error(`❌ Пользователь с email ${email} не найден`);
      process.exit(1);
    }

    console.log('✅ Пользователь обновлён:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

makeAdmin();
