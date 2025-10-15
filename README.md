# Banki Showcase - Админка для онлайн витрины

Telegram Mini App на Next.js для управления онлайн витринами банков и магазинов.

## Технологии

- **Frontend:**

  - Next.js 15 (App Router)
  - React 19
  - Telegram Web App SDK (@twa-dev/sdk)
  - Tailwind CSS
  - TypeScript

- **Backend:**
  - Next.js Server Actions
  - Prisma ORM
  - PostgreSQL

## Особенности

✅ **Без отдельного сервера** - все работает на Next.js Server Actions  
✅ **Server Components** для быстрой загрузки  
✅ **Проверка авторизации** через Prisma напрямую  
✅ **Оптимистичные обновления** с revalidatePath  
✅ **Telegram стилизация** с поддержкой темной темы  
✅ **Загрузка изображений** через ImgBB API с превью и валидацией

## Установка

1. Установите зависимости:

```bash
npm install
```

2. Создайте файл `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/banki_showcase"
TELEGRAM_BOT_TOKEN="your_bot_token_here"
IMGBB_API_KEY="your_imgbb_api_key_here"
SHOWCASE_DOMAIN="your-showcase-domain.com"
```

3. Примените миграции базы данных:

```bash
npx prisma migrate dev
```

4. Сгенерируйте Prisma Client:

```bash
npx prisma generate
```

## Разработка

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

## Структура проекта

```
.
├── prisma/
│   └── schema.prisma         # Схема базы данных
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Корневой layout
│   │   ├── page.tsx          # Главная страница
│   │   ├── showcase/         # Страницы витрин
│   │   └── unauthorized/     # Страница ошибки доступа
│   ├── components/
│   │   ├── pages/            # Клиентские компоненты страниц
│   │   └── providers/        # Provider компоненты
│   └── lib/
│       ├── prisma.ts         # Prisma client
│       ├── auth.ts           # Server Actions для авторизации
│       └── actions/          # Server Actions для CRUD
│           ├── showcases.ts
│           ├── topics.ts
│           ├── categories.ts
│           └── products.ts
└── package.json
```

## Авторизация

- Только пользователи из таблицы `users` могут получить доступ к приложению
- Проверка производится через Telegram ID пользователя
- Используется Server Action `checkUserAccess()` для проверки в БД

## Server Actions

Все CRUD операции выполняются через Server Actions:

### Showcases

- `getShowcases()` - получить все витрины
- `getShowcase(id)` - получить витрину по ID
- `createShowcase(data)` - создать витрину
- `updateShowcase(id, data)` - обновить витрину
- `deleteShowcase(id)` - удалить витрину
- `getShowcaseTopics(showcaseId)` - получить топики витрины
- `createTopic(showcaseId, title)` - создать топик

### Topics

- `getTopic(id)` - получить топик
- `deleteTopic(id, showcaseId)` - удалить топик
- `getTopicCategories(topicId)` - получить категории
- `createCategory(topicId, data)` - создать категорию

### Categories

- `getCategory(id)` - получить категорию
- `updateCategory(id, data)` - обновить категорию
- `deleteCategory(id, topicId)` - удалить категорию
- `getCategoryProducts(categoryId)` - получить продукты

### Products

- `createProduct(showcaseId, categoryId, data)` - создать продукт
- `deleteProduct(id, categoryId)` - удалить продукт

## Добавление пользователей

### Через скрипт (рекомендуется):

```bash
# Добавить пользователя
npm run user:add YOUR_TELEGRAM_ID

# Пример
npm run user:add 123456789

# Просмотреть всех пользователей
npm run user:list
```

### Через SQL:

```sql
INSERT INTO users (id, telegram_id, created_at)
VALUES (gen_random_uuid(), YOUR_TELEGRAM_ID, NOW());
```

### Как узнать свой Telegram ID:

1. Откройте бота [@userinfobot](https://t.me/userinfobot)
2. Нажмите `/start`
3. Бот отправит вам ваш Telegram ID

## Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота и добавьте его в `.env`
3. Настройте Web App:
   - Откройте @BotFather
   - Выберите `/mybots` → ваш бот → `Bot Settings` → `Menu Button` → `Configure Menu Button`
   - Укажите URL вашего приложения (например, через ngrok для разработки)

## Production Build

```bash
# Build приложения
npm run build

# Start production сервера
npm start
```

## Deployment

Приложение можно задеплоить на:

- Vercel (рекомендуется для Next.js)
- Netlify
- Railway
- Любой хостинг с поддержкой Node.js

## Лицензия

MIT
