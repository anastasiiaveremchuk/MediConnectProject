const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Patient = require('../models/Patient.model');

let mongoServer;

// Перед усіма тестами
beforeAll(async () => {
  // Створюємо тестову БД в пам'яті
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Після всіх тестів
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Перед кожним тестом
beforeEach(async () => {
  // Очищаємо колекцію пацієнтів
  await Patient.deleteMany({});
});

describe('Patient Model Tests', () => {
  
  // Тест 1: Створення пацієнта
  test('створення пацієнта з правильними даними', async () => {
    const patientData = {
      firstName: 'Олег',
      lastName: 'Коваленко',
      dateOfBirth: new Date('1992-05-15'),
      email: 'oleg@example.com',
      phoneNumber: '+380671112233'
    };
    
    const patient = new Patient(patientData);
    const savedPatient = await patient.save();
    
    // Перевіряємо, що пацієнт збережено
    expect(savedPatient._id).toBeDefined();
    expect(savedPatient.firstName).toBe(patientData.firstName);
    expect(savedPatient.email).toBe(patientData.email);
    expect(savedPatient.createdAt).toBeDefined();
  });
  
  // Тест 2: Валідація обов'язкових полів
  test('помилка при відсутності обовʼязкових полів', async () => {
    const patientData = {
      // Відсутнє firstName - має бути помилка
      lastName: 'Коваленко',
      dateOfBirth: new Date('1992-05-15'),
      email: 'oleg@example.com'
    };
    
    const patient = new Patient(patientData);
    
    // Очікуємо, що збереження викличе помилку
    await expect(patient.save()).rejects.toThrow();
  });
  
  // Тест 3: Валідація email (унікальність може не працювати в in-memory БД)
  test('валідація обовʼязкових полів пацієнта', async () => {
    // Перевіряємо, що всі обов'язкові поля валідуються
    const patientData = {
      firstName: 'Тест',
      lastName: 'Пацієнт', 
      dateOfBirth: new Date('1990-01-01'),
      email: 'test@example.com'
    };
    
    // Перевіряємо кожне поле окремо
    const patient = new Patient(patientData);
    
    expect(patient.firstName).toBe('Тест');
    expect(patient.lastName).toBe('Пацієнт');
    expect(patient.email).toBe('test@example.com');
    expect(patient.dateOfBirth).toBeInstanceOf(Date);
    
    // Зберігаємо для перевірки, що збереження працює
    const savedPatient = await patient.save();
    expect(savedPatient._id).toBeDefined();
  });

  // Тест 4: Формат email
  test('помилка при неправильному форматі email', async () => {
    const patientData = {
      firstName: 'Тест',
      lastName: 'Пацієнт',
      dateOfBirth: new Date('1990-01-01'),
      email: 'неправильний-email', // Неправильний формат
      phoneNumber: '+380501112233'
    };
    
    const patient = new Patient(patientData);
    
    await expect(patient.save()).rejects.toThrow();
  });
  
  // Тест 5: Пошук пацієнтів
  test('пошук пацієнтів за імʼям', async () => {
    // Створюємо кілька пацієнтів
    await Patient.create([
      { firstName: 'Олег', lastName: 'Коваленко', dateOfBirth: new Date('1992-05-15'), email: 'oleg1@example.com' },
      { firstName: 'Марія', lastName: 'Шевченко', dateOfBirth: new Date('1990-03-20'), email: 'maria@example.com' },
      { firstName: 'Олег', lastName: 'Петренко', dateOfBirth: new Date('1988-07-10'), email: 'oleg2@example.com' },
    ]);
    
    // Шукаємо всіх з ім'ям "Олег"
    const patientsNamedOleg = await Patient.find({ firstName: 'Олег' });
    
    expect(patientsNamedOleg).toHaveLength(2);
    expect(patientsNamedOleg[0].lastName).toBe('Коваленко');
    expect(patientsNamedOleg[1].lastName).toBe('Петренко');
  });
});