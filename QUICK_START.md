# 🚀 Быстрый старт ClientHub

## ✅ Исправленные ошибки

1. **TypeScript импорты** - исправлены все импорты типов (добавлен `type` перед импортами)
2. **Сборка проекта** - frontend и backend успешно компилируются

## 📋 Что нужно для запуска

### 1. Установить PostgreSQL

**Windows:**
- Скачать: https://www.postgresql.org/download/windows/
- Установить с паролем для пользователя `postgres`

**Создать базу данных:**
```sql
CREATE DATABASE clienthub;
```

### 2. Настроить Backend

```bash
cd "C:\web\api\Project Neuro-Protocol\clienthub-backend"

# Установить зависимости (если ещё не установлены)
npm install

# Отредактировать .env - указать свой пароль PostgreSQL
# DATABASE_URL=postgresql://postgres:ВАШ_ПАРОЛЬ@localhost:5432/clienthub

# Собрать проект
npm run build

# Создать таблицы в БД
npm run db:migrate

# Запустить сервер
npm run dev
```

Должно появиться: `🚀 Сервер запущен на порту 5000`

### 3. Настроить Frontend

Открыть **НОВЫЙ** терминал:

```bash
cd "C:\web\api\Project Neuro-Protocol\clienthub-frontend"

# Установить зависимости (если ещё не установлены)
npm install

# Запустить приложение
npm run dev
```

Должно появиться: `Local: http://localhost:5173/`

### 4. Открыть в браузере

Перейти на: **http://localhost:5173**

## 🎯 Тестирование

1. **Регистрация:**
   - Нажать "Нет аккаунта? Зарегистрируйтесь"
   - Ввести имя, email, пароль
   - Нажать "Зарегистрироваться"

2. **Создать клиента:**
   - Нажать "+ Добавить клиента"
   - Заполнить форму
   - Нажать "Создать"

3. **Открыть карточку клиента:**
   - Кликнуть на карточку клиента
   - Добавить заказ, взаимодействие, комментарий

## 🐛 Возможные проблемы

### Ошибка подключения к БД
```
Error: connect ECONNREFUSED
```
**Решение:**
- Проверить, что PostgreSQL запущен
- Проверить пароль в `.env`
- Проверить, что база `clienthub` создана

### Порт занят
```
Error: listen EADDRINUSE
```
**Решение:**
- Изменить `PORT=5001` в `.env`
- Обновить URL в `clienthub-frontend/src/api/axios.ts`

### CORS ошибки
```
Access to XMLHttpRequest has been blocked
```
**Решение:**
- Убедиться, что backend запущен на порту 5000
- Проверить, что в `server.ts` есть `app.use(cors())`

## 📁 Структура проекта

```
Project Neuro-Protocol/
├── clienthub-backend/          # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/        # Логика обработки запросов
│   │   ├── database/           # Подключение к БД и миграции
│   │   ├── middleware/         # JWT аутентификация
│   │   ├── routes/             # API маршруты
│   │   ├── types/              # TypeScript типы
│   │   └── server.ts           # Главный файл сервера
│   ├── .env                    # Настройки окружения
│   └── package.json
│
└── clienthub-frontend/         # React + TypeScript + Vite
    ├── src/
    │   ├── api/                # API клиенты
    │   ├── components/         # React компоненты
    │   ├── context/            # Контекст аутентификации
    │   ├── pages/              # Страницы приложения
    │   ├── types/              # TypeScript типы
    │   ├── App.tsx             # Главный компонент
    │   └── main.tsx            # Точка входа
    └── package.json
```

## 🎓 Для защиты проекта

Смотрите файлы:
- `PRESENTATION.md` - презентация на 20 слайдов
- `AI_USAGE.md` - как использовался ИИ
- `PROJECT_SUMMARY.md` - краткое резюме проекта
- `README.md` - полная документация

## ✨ Готово!

Проект полностью рабочий и готов к демонстрации.
