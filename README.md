# ClientHub - CRM система для учёта клиентов

Веб-приложение для управления клиентами, заказами и историей взаимодействия.

## Технологии

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL
- JWT аутентификация

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- React Query

## Установка и запуск

### Требования
- Node.js 18+
- PostgreSQL 14+

### Backend

1. Перейдите в папку backend:
```bash
cd clienthub-backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Настройте переменные окружения в `.env`:
```
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/clienthub
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

5. Создайте базу данных PostgreSQL:
```sql
CREATE DATABASE clienthub;
```

6. Запустите миграции:
```bash
npm run build
npm run db:migrate
```

7. Запустите сервер:
```bash
npm run dev
```

Сервер запустится на http://localhost:5000

### Frontend

1. Перейдите в папку frontend:
```bash
cd clienthub-frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите приложение:
```bash
npm run dev
```

Приложение откроется на http://localhost:5173

## Функционал

- ✅ Регистрация и авторизация пользователей
- ✅ Управление базой клиентов (создание, просмотр, редактирование, удаление)
- ✅ История заказов клиентов
- ✅ История взаимодействий (звонки, встречи, email, сообщения)
- ✅ Комментарии к клиентам
- ✅ Теги и заметки
- ✅ Отслеживание повторных касаний

## API Endpoints

### Аутентификация
- POST `/api/auth/register` - Регистрация
- POST `/api/auth/login` - Вход
- GET `/api/auth/me` - Получить текущего пользователя

### Клиенты
- GET `/api/clients` - Список всех клиентов
- GET `/api/clients/:id` - Детали клиента
- POST `/api/clients` - Создать клиента
- PUT `/api/clients/:id` - Обновить клиента
- DELETE `/api/clients/:id` - Удалить клиента

### Заказы
- POST `/api/orders` - Создать заказ
- PUT `/api/orders/:id` - Обновить заказ
- DELETE `/api/orders/:id` - Удалить заказ

### Взаимодействия
- POST `/api/interactions` - Создать взаимодействие
- DELETE `/api/interactions/:id` - Удалить взаимодействие

### Комментарии
- POST `/api/comments` - Создать комментарий
- DELETE `/api/comments/:id` - Удалить комментарий
