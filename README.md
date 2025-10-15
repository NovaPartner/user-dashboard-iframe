# User Dashboard - Панель Водія

## 📋 Опис проєкту
Web-додаток для відображення персональних даних водіїв та подання заявок. Система автоматично отримує дані з Google Sheets через Google Apps Script API.

## 🏗️ Архітектура

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────┐       ┌──────────────┐
│   Browser   │ ----> │ Netlify Function │ ----> │ Google Apps     │ ----> │ Google       │
│ (index.html)│       │    (api.js)      │       │ Script          │       │ Sheets       │
└─────────────┘       └──────────────────┘       │ (ApiHandler.js) │       └──────────────┘
                                                  └─────────────────┘
```

### Потік даних:
1. **Користувач** відкриває `index.html?driverid=10003`
2. **Frontend** відправляє POST запит до Netlify Function
3. **Netlify Function** проксує запит до Google Apps Script
4. **Google Apps Script** обробляє запит та взаємодіє з Google Sheets
5. **Дані** повертаються назад через всі шари до браузера

## 🛠️ Технології

### Frontend
- **HTML5** - розмітка сторінки
- **CSS3** - стилізація з градієнтами, анімаціями та респонсивним дизайном
- **Vanilla JavaScript** - логіка роботи без фреймворків
- **Fetch API** - для HTTP запитів

### Backend
- **Google Apps Script** - серверна логіка
  - `ApiHandler.js` - обробник API запитів (doGet, doPost)
  - Інтеграція з Google Sheets
  - REST API endpoints

### Проксі-шар
- **Netlify Functions** (Production) - serverless функції
  - `netlify/functions/api.js` - проксі до Google Apps Script
  - Автоматичний CORS
  - Node.js runtime
  
- **Python Proxy** (Development) - локальний сервер для розробки
  - `proxy.py` - HTTP сервер на порту 8000
  - CORS підтримка

### База даних
- **Google Sheets** - зберігання даних водіїв
  - Sheet1 - дані водіїв
  - Sheet2 - заявки водіїв

### DevOps & Deployment
- **Git** - контроль версій
- **GitHub** - хостинг репозиторію
- **Netlify** - хостинг та CI/CD
  - Автоматичний деплой з Git
  - Serverless functions
  - CDN для статичних файлів

## 📁 Структура проєкту

```
user-dashboard-iframe/
├── ApiHandler.js              # Google Apps Script API обробник
├── index.html                 # Головна сторінка додатку
├── proxy.py                   # Локальний proxy для розробки
├── netlify/
│   └── functions/
│       └── api.js            # Netlify Function (проксі)
├── netlify.toml              # Конфігурація Netlify
├── package.json              # Залежності Node.js
└── README.md                 # Документація
```

## 🚀 Deployment Process

### Production (Netlify)
```
1. git add .
2. git commit -m "..."
3. git push origin main
   ↓
4. Netlify автоматично детектує зміни
   ↓
5. Netlify збирає проєкт
   ↓
6. Деплой на https://your-app.netlify.app
```

### Google Apps Script
```
1. Відкрити Google Apps Script проєкт
2. Оновити код ApiHandler.js
3. Deploy → New deployment
4. Скопіювати новий URL веб-додатку
5. Оновити URL в api.js та proxy.py (якщо змінився)
```

## 💻 Локальна розробка

### 1. Запустити proxy сервер
```bash
python proxy.py
```

### 2. Відкрити в браузері
```
http://localhost:8000/index.html?driverid=10003
```

## 🔧 Налаштування

### Environment Variables (Netlify)
Не потрібні - URL Google Apps Script захардкоджений в `api.js`

### Google Apps Script Setup
1. Створити новий проєкт в Google Apps Script
2. Скопіювати код з `ApiHandler.js`
3. Deploy as Web App
4. Permissions: Anyone with the link
5. Скопіювати deployment URL
6. Оновити URL в:
   - `netlify/functions/api.js` (рядок 30)
   - `proxy.py` (рядок 20)

## 📊 API Endpoints

### POST `/` (doPost)

#### Operation: `get_driver_info`
**Request:**
```json
{
  "operationName": "get_driver_info",
  "driverId": "10003"
}
```

**Response:**
```json
{
  "driver_identifier": "10003",
  "full_name": "Jan Kowalski",
  "balance": 1250.50,
  "city": "Warszawa",
  "phone_number": "48123456789"
}
```

#### Operation: `post_driver_info`
**Request:**
```json
{
  "operationName": "post_driver_info",
  "driverData": {
    "driver_identifier": "10003",
    "full_name": "Jan Kowalski",
    "balance": 1250.50,
    "city": "Warszawa",
    "phone_number": "48123456789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wniosek został przyjęty"
}
```

#### Operation: `create_driver` (Створення нового водія)
**Request:**
```json
{
  "operationName": "create_driver",
  "driverData": {
    "driver_identifier": "10004",
    "full_name": "Anna Nowak",
    "phone_number": "48987654321",
    "city": "Kraków",
    "email": "anna.nowak@example.com"
  }
}
```

**Response (успіх):**
```json
{
  "success": true,
  "message": "Kierowca został pomyślnie dodany",
  "driver_id": "10004"
}
```

**Response (помилка - водій вже існує):**
```json
{
  "error": "Kierowca z takim ID już istnieje"
}
```

**Response (помилка - відсутні обов'язкові поля):**
```json
{
  "error": "ID i imię kierowcy są wymagane"
}
```

## 🔐 Безпека

- ✅ CORS налаштований коректно
- ✅ Netlify Functions як проксі (приховує прямий URL Google Apps Script)
- ⚠️ Публічний доступ до Google Apps Script (за посиланням)
- ⚠️ Немає автентифікації користувачів

## 🎨 Features

- 📱 **Responsive дизайн** - працює на всіх пристроях
- ⚡ **Швидке завантаження** - CDN через Netlify
- 🎭 **Анімації** - плавні переходи та hover ефекти
- 🔄 **Real-time валідація** - перевірка даних перед відправкою
- ✨ **Modern UI** - градієнти, box-shadows, blur ефекти

## 📝 Ліцензія

MIT License

## 👨‍💻 Автор

User Dashboard Project

