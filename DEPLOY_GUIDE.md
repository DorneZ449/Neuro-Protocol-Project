# 🚀 ДЕПЛОЙ ПРОЕКТА CLIENTHUB

## 📋 Что нужно перед началом

1. ✅ Аккаунт на GitHub (если нет - создай на https://github.com)
2. ✅ Git установлен на компьютере
3. ✅ Проект работает локально

---

## 🎯 План деплоя

1. **Загрузить код на GitHub** (5 минут)
2. **Задеплоить Backend на Render** (10 минут)
3. **Задеплоить Frontend на Vercel** (5 минут)
4. **Проверить работу** (2 минуты)

**Итого: ~20 минут**

---

# ЧАСТЬ 1: Загрузка на GitHub

## Шаг 1: Создать репозиторий на GitHub

1. Открой https://github.com
2. Нажми **"New repository"** (зелёная кнопка справа)
3. Заполни:
   - **Repository name:** `clienthub`
   - **Description:** `CRM система для управления клиентами`
   - **Public** (выбери публичный)
   - ❌ НЕ ставь галочки на "Add README" и "Add .gitignore"
4. Нажми **"Create repository"**

## Шаг 2: Загрузить код

Открой терминал в папке проекта:

```bash
cd "C:\web\api\Project Neuro-Protocol"

# Инициализировать git (если ещё не сделано)
git init

# Добавить все файлы
git add .

# Создать коммит
git commit -m "Initial commit: ClientHub CRM"

# Добавить удалённый репозиторий (замени YOUR_USERNAME на своё имя)
git remote add origin https://github.com/YOUR_USERNAME/clienthub.git

# Загрузить код
git branch -M main
git push -u origin main
```

**Готово!** Код теперь на GitHub.

---

# ЧАСТЬ 2: Деплой Backend на Render

## Шаг 1: Создать аккаунт на Render

1. Открой https://render.com
2. Нажми **"Get Started"**
3. Войди через **GitHub** (Sign in with GitHub)
4. Разреши доступ к репозиториям

## Шаг 2: Создать PostgreSQL базу данных

1. В Render Dashboard нажми **"New +"** → **"PostgreSQL"**
2. Заполни:
   - **Name:** `clienthub-db`
   - **Database:** `clienthub`
   - **User:** `clienthub`
   - **Region:** выбери ближайший (например, Frankfurt)
   - **Plan:** **Free** (бесплатный)
3. Нажми **"Create Database"**
4. **ВАЖНО:** Скопируй **Internal Database URL** (понадобится дальше)
   - Выглядит так: `postgresql://clienthub:xxx@xxx.oregon-postgres.render.com/clienthub`

## Шаг 3: Создать Web Service для Backend

1. Нажми **"New +"** → **"Web Service"**
2. Выбери свой репозиторий **"clienthub"**
3. Нажми **"Connect"**
4. Заполни:
   - **Name:** `clienthub-api`
   - **Region:** тот же, что и база данных
   - **Branch:** `main`
   - **Root Directory:** `clienthub-backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Plan:** **Free**

5. **Environment Variables** (переменные окружения):
   Нажми **"Add Environment Variable"** и добавь:

   ```
   PORT = 5000
   NODE_ENV = production
   JWT_SECRET = твой-секретный-ключ-измени-это-на-что-то-сложное
   DATABASE_URL = (вставь Internal Database URL из шага 2)
   ```

6. Нажми **"Create Web Service"**

## Шаг 4: Запустить миграции

После того как backend задеплоится (5-10 минут):

1. Открой свой сервис `clienthub-api`
2. Перейди на вкладку **"Shell"**
3. Выполни команду:
   ```bash
   npm run db:migrate
   ```
4. Должно появиться: `✅ Таблицы успешно созданы`

**Готово!** Backend работает на `https://clienthub-api.onrender.com`

---

# ЧАСТЬ 3: Деплой Frontend на Vercel

## Шаг 1: Создать аккаунт на Vercel

1. Открой https://vercel.com
2. Нажми **"Sign Up"**
3. Войди через **GitHub** (Continue with GitHub)
4. Разреши доступ

## Шаг 2: Задеплоить Frontend

1. В Vercel Dashboard нажми **"Add New..."** → **"Project"**
2. Найди и выбери репозиторий **"clienthub"**
3. Нажми **"Import"**
4. Настрой проект:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `clienthub-frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Environment Variables:**
   Нажми **"Add"** и добавь:
   ```
   VITE_API_URL = https://clienthub-api.onrender.com/api
   ```
   (Замени на свой URL backend из Render)

6. Нажми **"Deploy"**

Подожди 2-3 минуты. Vercel соберёт и задеплоит проект.

**Готово!** Frontend работает на `https://clienthub-xxx.vercel.app`

---

# ЧАСТЬ 4: Проверка работы

## Шаг 1: Открой свой сайт

1. Скопируй URL из Vercel (например, `https://clienthub-xxx.vercel.app`)
2. Открой в браузере
3. Должна открыться страница входа

## Шаг 2: Зарегистрируйся

1. Нажми **"Нет аккаунта? Зарегистрируйтесь"**
2. Введи:
   - Имя: `Тест`
   - Email: `test@test.com`
   - Пароль: `123456`
3. Нажми **"Зарегистрироваться"**

## Шаг 3: Протестируй

1. Создай клиента
2. Добавь заказ
3. Добавь взаимодействие
4. Проверь дашборд

**Если всё работает - ПОЗДРАВЛЯЮ! 🎉**

---

# 🐛 Решение проблем

## Backend не запускается

**Проблема:** Ошибка при деплое

**Решение:**
1. Открой Render → твой сервис → вкладка **"Logs"**
2. Посмотри ошибку
3. Чаще всего проблема в:
   - Неправильный `DATABASE_URL`
   - Не запущены миграции
   - Неправильный `Build Command`

## Frontend не подключается к Backend

**Проблема:** Ошибки CORS или "Network Error"

**Решение:**
1. Проверь, что `VITE_API_URL` правильный
2. Проверь, что backend работает (открой `https://твой-backend.onrender.com`)
3. Пересобери frontend:
   - Vercel → твой проект → **"Deployments"** → **"Redeploy"**

## Backend засыпает

**Проблема:** Первый запрос очень медленный (30+ секунд)

**Решение:**
- Это нормально для бесплатного плана Render
- Backend засыпает после 15 минут неактивности
- Первый запрос "будит" его (занимает 30-60 секунд)
- Последующие запросы быстрые

**Как исправить:**
- Платный план Render ($7/месяц) - backend не засыпает
- Или использовать Railway (бесплатно $5 кредитов в месяц)

## База данных заполнена

**Проблема:** "Database is full"

**Решение:**
- Бесплатный план Render: 1 GB
- Этого хватит на ~10,000 клиентов
- Если нужно больше - платный план ($7/месяц = 10 GB)

---

# 📝 Полезные команды

## Обновить код на GitHub

```bash
cd "C:\web\api\Project Neuro-Protocol"
git add .
git commit -m "Описание изменений"
git push
```

После push:
- Render автоматически пересоберёт backend
- Vercel автоматически пересоберёт frontend

## Посмотреть логи

**Render:**
1. Открой свой сервис
2. Вкладка **"Logs"**

**Vercel:**
1. Открой свой проект
2. Вкладка **"Deployments"** → выбери деплой → **"View Function Logs"**

---

# 🎯 Итоговые ссылки

После деплоя у тебя будет:

- **Frontend:** `https://clienthub-xxx.vercel.app`
- **Backend:** `https://clienthub-api.onrender.com`
- **База данных:** на Render (внутренняя)

**Можешь делиться ссылкой на frontend с кем угодно!**

---

# 💡 Советы

1. **Кастомный домен** (опционально):
   - Vercel позволяет добавить свой домен бесплатно
   - Например: `clienthub.ru` вместо `clienthub-xxx.vercel.app`

2. **Мониторинг:**
   - Render показывает статистику использования
   - Vercel показывает количество посещений

3. **Обновления:**
   - Просто делай `git push` - всё обновится автоматически

4. **Безопасность:**
   - Измени `JWT_SECRET` на что-то сложное
   - Не коммить `.env` файлы в git

---

# ✅ Чеклист деплоя

- [ ] Код загружен на GitHub
- [ ] PostgreSQL база создана на Render
- [ ] Backend задеплоен на Render
- [ ] Миграции запущены (`npm run db:migrate`)
- [ ] Frontend задеплоен на Vercel
- [ ] `VITE_API_URL` настроен правильно
- [ ] Сайт открывается
- [ ] Регистрация работает
- [ ] Можно создать клиента
- [ ] Дашборд показывает статистику

---

# 🎉 Готово!

Теперь твой проект доступен всем по ссылке!

**Поделись ссылкой с друзьями и покажи, что получилось!** 🚀

---

# 📞 Если нужна помощь

1. Проверь логи на Render и Vercel
2. Убедись, что все переменные окружения правильные
3. Попробуй пересобрать проект
4. Проверь, что backend работает (открой URL в браузере)

**Удачи с деплоем!** 💪
