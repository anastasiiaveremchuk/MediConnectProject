require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Імпортуємо маршрути
const patientRoutes = require('./routes/patient.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Обслуговуємо статичні файли з папки public
app.use(express.static('public'));

// Додаємо логування запитів (для наочності)
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// Маршрути
app.use('/api/patients', patientRoutes);

// Простий тестовий маршрут
// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Експортуємо app для тестів
module.exports = app;

// Запускаємо сервер тільки якщо файл виконується напряму
if (require.main === module) {
  // Підключаємось до бази даних
  console.log('🟡 Починаємо підключення до бази даних...');
  connectDB();

  // Встановлюємо порт
  const PORT = process.env.PORT || 5000;

  // Запускаємо сервер
  app.listen(PORT, () => {
    console.log(` Сервер працює на порту ${PORT}`);
    console.log(` Відкрийте в браузері: http://localhost:${PORT}`);
    console.log(` API доступне за адресою: http://localhost:${PORT}/api/patients`);
    console.log('──────────────────────────────────────');
    console.log(' Логи запитів будуть відображатись нижче:');
  });
}