import pool from './db';

const updateAvatarType = async () => {
  try {
    await pool.query(`
      ALTER TABLE users
      ALTER COLUMN avatar_url TYPE TEXT;
    `);
    console.log('✅ Тип колонки avatar_url обновлён на TEXT');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
};

updateAvatarType();
