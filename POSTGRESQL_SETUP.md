# 🗄️ Установка и настройка PostgreSQL для ClientHub

## Вариант 1: Установка через установщик (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Скачать установщик
1. Перейди на https://www.postgresql.org/download/windows/
2. Нажми "Download the installer"
3. Скачай версию PostgreSQL 14 или выше (например, PostgreSQL 16)
4. Запусти установщик `.exe`

### Шаг 2: Установка
1. **Welcome** - нажми "Next"
2. **Installation Directory** - оставь по умолчанию `C:\Program Files\PostgreSQL\16`
3. **Select Components** - выбери все (PostgreSQL Server, pgAdmin 4, Command Line Tools)
4. **Data Directory** - оставь по умолчанию
5. **Password** - ВАЖНО! Придумай и запомни пароль для пользователя `postgres`
   - Например: `postgres123` (запиши его!)
6. **Port** - оставь `5432`
7. **Locale** - оставь по умолчанию
8. Нажми "Next" и дождись установки

### Шаг 3: Проверка установки
1. Открой меню "Пуск"
2. Найди "pgAdmin 4" и запусти
3. Если открылось - PostgreSQL установлен правильно!

---

## Вариант 2: Использование твоих binaries (сложнее)

Если хочешь использовать скачанные binaries, вот инструкция:

### Шаг 1: Распаковать
```bash
# Распакуй архив в папку, например:
C:\PostgreSQL\
```

### Шаг 2: Инициализировать базу данных
```bash
# Открой PowerShell от имени администратора
cd C:\PostgreSQL\pgsql\bin

# Создай папку для данных
mkdir C:\PostgreSQL\data

# Инициализируй базу данных
.\initdb.exe -D C:\PostgreSQL\data -U postgres -W -E UTF8
# Введи пароль для пользователя postgres (например: postgres123)
```

### Шаг 3: Запустить сервер
```bash
# Запусти PostgreSQL сервер
.\pg_ctl.exe -D C:\PostgreSQL\data -l logfile start
```

### Шаг 4: Добавить в PATH (опционально)
1. Открой "Система" → "Дополнительные параметры системы"
2. "Переменные среды"
3. В "Системные переменные" найди `Path`
4. Добавь `C:\PostgreSQL\pgsql\bin`

---

## 📋 Создание базы данных ClientHub

### Способ 1: Через pgAdmin (графический интерфейс)

1. Открой **pgAdmin 4**
2. Подключись к серверу (введи пароль, который создал)
3. Правой кнопкой на "Databases" → "Create" → "Database"
4. Имя базы: `clienthub`
5. Нажми "Save"

### Способ 2: Через командную строку (psql)

```bash
# Открой командную строку
# Если PostgreSQL в PATH:
psql -U postgres

# Если нет, то:
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres

# Введи пароль
# В консоли psql выполни:
CREATE DATABASE clienthub;

# Проверь, что база создана:
\l

# Выйди:
\q
```

### Способ 3: Через PowerShell (быстро)

```bash
# Открой PowerShell
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres -c "CREATE DATABASE clienthub;"
# Введи пароль
```

---

## ⚙️ Настройка Backend для подключения к БД

### Шаг 1: Открой файл .env
```bash
cd "C:\web\api\Project Neuro-Protocol\clienthub-backend"
notepad .env
```

### Шаг 2: Измени DATABASE_URL
```env
PORT=5000
DATABASE_URL=postgresql://postgres:ТВОЙ_ПАРОЛЬ@localhost:5432/clienthub
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

**Замени `ТВОЙ_ПАРОЛЬ` на пароль, который ты создал при установке PostgreSQL!**

Например, если пароль `postgres123`:
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/clienthub
```

### Шаг 3: Сохрани файл

---

## 🚀 Запуск Backend

```bash
cd "C:\web\api\Project Neuro-Protocol\clienthub-backend"

# Установи зависимости (если ещё не установлены)
npm install

# Собери проект
npm run build

# Создай таблицы в базе данных
npm run db:migrate

# Запусти сервер
npm run dev
```

Если всё правильно, увидишь:
```
🚀 Сервер запущен на порту 5000
```

---

## 🐛 Решение проблем

### Ошибка: "password authentication failed"
**Проблема:** Неправильный пароль в `.env`

**Решение:**
1. Открой `.env`
2. Проверь пароль в `DATABASE_URL`
3. Убедись, что это тот же пароль, что ты вводил при установке PostgreSQL

### Ошибка: "database clienthub does not exist"
**Проблема:** База данных не создана

**Решение:**
```bash
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres -c "CREATE DATABASE clienthub;"
```

### Ошибка: "could not connect to server"
**Проблема:** PostgreSQL не запущен

**Решение:**
1. Открой "Службы" (services.msc)
2. Найди "postgresql-x64-16" (или другая версия)
3. Нажми "Запустить"

### Ошибка: "psql is not recognized"
**Проблема:** PostgreSQL не в PATH

**Решение:**
```bash
# Используй полный путь:
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres
```

---

## ✅ Проверка, что всё работает

### 1. Проверь, что PostgreSQL запущен
```bash
# Открой PowerShell
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres -c "SELECT version();"
```

Должна появиться версия PostgreSQL.

### 2. Проверь, что база создана
```bash
.\psql.exe -U postgres -c "\l" | findstr clienthub
```

Должна появиться строка с `clienthub`.

### 3. Проверь подключение из backend
```bash
cd "C:\web\api\Project Neuro-Protocol\clienthub-backend"
npm run db:migrate
```

Должно появиться: `✅ Таблицы успешно созданы`

---

## 📝 Краткая шпаргалка

### Создать базу:
```bash
cd "C:\Program Files\PostgreSQL\16\bin"
.\psql.exe -U postgres -c "CREATE DATABASE clienthub;"
```

### Проверить базы:
```bash
.\psql.exe -U postgres -c "\l"
```

### Подключиться к базе:
```bash
.\psql.exe -U postgres -d clienthub
```

### Посмотреть таблицы:
```sql
\dt
```

### Выйти:
```sql
\q
```

---

## 🎯 Что делать дальше

После установки PostgreSQL и создания базы:

1. ✅ Настрой `.env` с правильным паролем
2. ✅ Запусти `npm run db:migrate` в backend
3. ✅ Запусти `npm run dev` в backend
4. ✅ Запусти `npm run dev` в frontend
5. ✅ Открой http://localhost:5173

---

## 💡 Мой совет

**Используй Вариант 1 (установщик)** - это проще и надёжнее. Установщик автоматически:
- Установит PostgreSQL как службу Windows
- Настроит автозапуск
- Установит pgAdmin 4 (удобный графический интерфейс)
- Добавит всё в PATH

Твои binaries можно использовать, но это сложнее для новичка.

---

## 📞 Если нужна помощь

1. Проверь, что PostgreSQL запущен (services.msc)
2. Проверь пароль в `.env`
3. Проверь, что база `clienthub` создана
4. Посмотри логи ошибок в терминале

**Удачи! 🚀**
