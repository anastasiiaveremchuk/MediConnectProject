const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    // ⚡⚡⚡ ГЕНІАЛЬНИЙ ТРИК ТУТ ⚡⚡⚡
    // На машині: process.env.MONGODB_URI === undefined → false
    // На Render: process.env.MONGODB_URI === "mongodb+srv://..." → true
    const atlasUri = process.env.MONGODB_URI;
    
    if (atlasUri) {
      // 📍 ЦЕ ВИКОНАЄТЬСЯ ТІЛЬКИ НА RENDER
      console.log('🌐 Підключення до MongoDB Atlas...');
      await mongoose.connect(atlasUri);
      console.log('✅ Підключено до MongoDB Atlas');
      
    } else {
      // 📍 ЦЕ ВИКОНАЄТЬСЯ НА ВАШІЙ МАШИНІ
      // ВСЬОМЕЙ РОБОЧИЙ КОД З ВАШОГО ФАЙЛУ!
      console.log('💻 Створення in-memory бази даних MongoDB...');
      
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      console.log(`📁 URI бази даних: ${mongoUri}`);
      
      const conn = await mongoose.connect(mongoUri);
      
      console.log('✅ Підключено до in-memory MongoDB');
      console.log('💾 База даних створена в оперативній памʼяті');
    }
    
  } catch (error) {
    console.error(`❌ Помилка: ${error.message}`);
    process.exit(1);
  }
};

// Функція для зупинки БД (для тестів) - ЗАЛИШАЄМО
const closeDB = async () => {
  if (mongoServer) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log('🔌 Зʼєднання з базою даних закрите');
  }
};

// Експортуємо як і раніше - щоб ваші тести не зламалися
module.exports = { connectDB, closeDB };