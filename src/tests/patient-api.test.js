const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Імпортуємо наш сервер
const app = require('../server');

let mongoServer;
let server;

beforeAll(async () => {
  // Створюємо тестову БД
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Підключаємося до БД
  await mongoose.connect(mongoUri);
  
  // Запускаємо сервер на тестовому порту
  server = app.listen(5001);
});

afterAll(async () => {
  // Зупиняємо все
  await server.close();
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Очищаємо БД перед кожним тестом
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Patient API Tests', () => {
  // Тест 1: GET /api/patients - пустий список
  test('GET /api/patients returns empty list initially', async () => {
    const response = await request(server)
      .get('/api/patients')
      .expect(200);
    
    expect(response.body).toEqual([]);
  });
  
  // Тест 2: POST /api/patients - створення пацієнта
  test('POST /api/patients creates new patient', async () => {
    const patientData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      email: 'john@example.com',
      phoneNumber: '+1234567890'
    };
    
    const response = await request(server)
      .post('/api/patients')
      .send(patientData)
      .expect(201); // 201 Created
    
    // Перевіряємо відповідь
    expect(response.body).toHaveProperty('_id');
    expect(response.body.firstName).toBe(patientData.firstName);
    expect(response.body.email).toBe(patientData.email);
  });
  
  // Тест 3: GET /api/patients - непорожній список
  test('GET /api/patients returns list of patients', async () => {
    // Спочатку створимо пацієнта
    await request(server)
      .post('/api/patients')
      .send({
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1990-01-01',
        email: 'test@example.com'
      });
    
    // Тепер перевіримо список
    const response = await request(server)
      .get('/api/patients')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Test');
  });
  
  // Тест 4: GET /api/patients/:id - отримати конкретного пацієнта
  test('GET /api/patients/:id returns specific patient', async () => {
    // Спочатку створюємо пацієнта
    const createResponse = await request(server)
      .post('/api/patients')
      .send({
        firstName: 'Find',
        lastName: 'Me',
        dateOfBirth: '1995-05-05',
        email: 'search@example.com'
      });
    
    const id = createResponse.body._id;
    
    // Шукаємо його по ID
    const response = await request(server)
      .get(`/api/patients/${id}`)
      .expect(200);
    
    expect(response.body._id).toBe(id);
    expect(response.body.firstName).toBe('Find');
  });
  
  // Тест 5: GET /api/patients/:id - помилка при неіснуючому ID
  test('GET /api/patients/:id returns 404 for non-existent patient', async () => {
    const fakeId = new mongoose.Types.ObjectId(); // Створюємо випадковий ID
    
    await request(server)
      .get(`/api/patients/${fakeId}`)
      .expect(404); // 404 Not Found
  });
  
  // Тест 6: PUT /api/patients/:id - оновлення пацієнта
  test('PUT /api/patients/:id updates patient', async () => {
    // Створюємо пацієнта
    const createResponse = await request(server)
      .post('/api/patients')
      .send({
        firstName: 'Old',
        lastName: 'Name',
        dateOfBirth: '1980-01-01',
        email: 'old@example.com',
        phoneNumber: '+380500000000'
      });
    
    const id = createResponse.body._id;
    
    // Оновлюємо його
    const updateResponse = await request(server)
      .put(`/api/patients/${id}`)
      .send({
        phoneNumber: '+380991112233',
        lastName: 'NewLastName'
      })
      .expect(200);
    
    expect(updateResponse.body.phoneNumber).toBe('+380991112233');
    expect(updateResponse.body.lastName).toBe('NewLastName');
    expect(updateResponse.body.firstName).toBe('Old'); // Не змінилося
  });
  
  // Тест 7: DELETE /api/patients/:id - видалення пацієнта
  test('DELETE /api/patients/:id deletes patient', async () => {
    // Створюємо пацієнта
    const createResponse = await request(server)
      .post('/api/patients')
      .send({
        firstName: 'Delete',
        lastName: 'Me',
        dateOfBirth: '1970-01-01',
        email: 'delete@example.com'
      });
    
    const id = createResponse.body._id;
    
    // Видаляємо
    const deleteResponse = await request(server)
      .delete(`/api/patients/${id}`)
      .expect(200);
    
    // Перевіряємо, що відповідь має message та id
    expect(deleteResponse.body).toHaveProperty('message');
    expect(deleteResponse.body.id).toBe(id);
    
    // Перевіряємо, що пацієнта більше немає
    await request(server)
      .get(`/api/patients/${id}`)
      .expect(404);
  });
});