import pool from './db';
import bcrypt from 'bcrypt';

const seedData = async () => {
  try {
    console.log('🌱 Начинаем заполнение демо-данными...');

    // Создаем тестового пользователя
    const password_hash = await bcrypt.hash('demo123', 10);
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         name = EXCLUDED.name,
         role = EXCLUDED.role
       RETURNING id`,
      ['demo@clienthub.com', password_hash, 'Демо Пользователь', 'admin']
    );
    const userId = userResult.rows[0].id;
    console.log('✅ Создан пользователь: demo@clienthub.com / demo123');

    // Создаем клиентов
    const clients = [
      {
        name: 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        email: 'ivan.petrov@example.com',
        company: 'ООО "Технологии"',
        tags: 'VIP, Постоянный',
        notes: 'Крупный клиент, работаем с 2023 года'
      },
      {
        name: 'Мария Сидорова',
        phone: '+7 (999) 234-56-78',
        email: 'maria.sidorova@example.com',
        company: 'ИП Сидорова',
        tags: 'Новый',
        notes: 'Обратилась по рекомендации'
      },
      {
        name: 'Алексей Смирнов',
        phone: '+7 (999) 345-67-89',
        email: 'alex.smirnov@example.com',
        company: 'ООО "Строй-Мастер"',
        tags: 'Постоянный',
        notes: 'Заказывает регулярно, каждый месяц'
      },
      {
        name: 'Елена Козлова',
        phone: '+7 (999) 456-78-90',
        email: 'elena.kozlova@example.com',
        company: null,
        tags: 'VIP',
        notes: 'Требует особого внимания'
      },
      {
        name: 'Дмитрий Волков',
        phone: '+7 (999) 567-89-01',
        email: 'dmitry.volkov@example.com',
        company: 'ООО "Консалтинг Плюс"',
        tags: 'Потенциальный',
        notes: 'Пока только консультация'
      }
    ];

    const clientIds = [];
    for (const client of clients) {
      const result = await pool.query(
        `INSERT INTO clients (name, phone, email, company, tags, notes, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id`,
        [client.name, client.phone, client.email, client.company, client.tags, client.notes, userId]
      );
      clientIds.push(result.rows[0].id);
    }
    console.log(`✅ Создано ${clients.length} клиентов`);

    // Создаем заказы
    const orders = [
      { client_id: clientIds[0], title: 'Разработка веб-сайта', description: 'Корпоративный сайт с админ-панелью', amount: 150000, status: 'completed', order_date: '2024-01-15' },
      { client_id: clientIds[0], title: 'Техподдержка сайта', description: 'Ежемесячная поддержка', amount: 15000, status: 'completed', order_date: '2024-02-01' },
      { client_id: clientIds[1], title: 'Консультация по SEO', description: 'Аудит сайта и рекомендации', amount: 25000, status: 'completed', order_date: '2024-03-10' },
      { client_id: clientIds[2], title: 'Мобильное приложение', description: 'iOS и Android приложение', amount: 300000, status: 'pending', order_date: '2024-04-01' },
      { client_id: clientIds[3], title: 'Дизайн логотипа', description: 'Фирменный стиль компании', amount: 50000, status: 'completed', order_date: '2024-03-20' },
      { client_id: clientIds[4], title: 'Консультация', description: 'Первичная консультация', amount: 5000, status: 'pending', order_date: '2024-04-13' }
    ];

    for (const order of orders) {
      await pool.query(
        `INSERT INTO orders (client_id, title, description, amount, status, order_date, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [order.client_id, order.title, order.description, order.amount, order.status, order.order_date, userId]
      );
    }
    console.log(`✅ Создано ${orders.length} заказов`);

    // Создаем взаимодействия
    const interactions = [
      { client_id: clientIds[0], type: 'call', description: 'Обсудили новый проект', interaction_date: '2024-04-10' },
      { client_id: clientIds[0], type: 'email', description: 'Отправил коммерческое предложение', interaction_date: '2024-04-11' },
      { client_id: clientIds[1], type: 'meeting', description: 'Встреча в офисе клиента', interaction_date: '2024-03-15' },
      { client_id: clientIds[2], type: 'call', description: 'Уточнили требования к приложению', interaction_date: '2024-04-05' },
      { client_id: clientIds[3], type: 'message', description: 'Переписка в WhatsApp', interaction_date: '2024-04-12' },
      { client_id: clientIds[4], type: 'call', description: 'Первый звонок, обсудили задачу', interaction_date: '2024-04-13' }
    ];

    for (const interaction of interactions) {
      await pool.query(
        `INSERT INTO interactions (client_id, type, description, interaction_date, created_by) 
         VALUES ($1, $2, $3, $4, $5)`,
        [interaction.client_id, interaction.type, interaction.description, interaction.interaction_date, userId]
      );
    }
    console.log(`✅ Создано ${interactions.length} взаимодействий`);

    // Создаем комментарии
    const comments = [
      { client_id: clientIds[0], text: 'Очень доволен результатом, рекомендует нас друзьям' },
      { client_id: clientIds[1], text: 'Нужно связаться через неделю для уточнения деталей' },
      { client_id: clientIds[2], text: 'Важно: дедлайн проекта - конец месяца!' },
      { client_id: clientIds[3], text: 'Предпочитает общение по email' },
      { client_id: clientIds[4], text: 'Потенциально крупный клиент, нужно проявить внимание' }
    ];

    for (const comment of comments) {
      await pool.query(
        `INSERT INTO comments (client_id, text, created_by) 
         VALUES ($1, $2, $3)`,
        [comment.client_id, comment.text, userId]
      );
    }
    console.log(`✅ Создано ${comments.length} комментариев`);

    console.log('\n🎉 Демо-данные успешно добавлены!');
    console.log('\n📝 Данные для входа:');
    console.log('   Email: demo@clienthub.com');
    console.log('   Пароль: demo123');
    console.log('\n');

  } catch (error) {
    console.error('❌ Ошибка при добавлении демо-данных:', error);
    throw error;
  }
};

seedData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
