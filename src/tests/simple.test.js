// test 1: Перевірка, що 1+1=2
test('1 + 1 = 2', () => {
  expect(1 + 1).toBe(2);
});

// test 2: Перевірка рядка
test('рядок "hello" має довжину 5', () => {
  expect("hello").toHaveLength(5);
});

// test 3: Перевірка масиву
test('масив [1, 2, 3] містить 1', () => {
  expect([1, 2, 3]).toContain(1);
});

// test 4: Перевірка об'єкта
test('обʼєкт має властивість name', () => {
  const user = { name: 'Іван', age: 30 };
  expect(user).toHaveProperty('name');
  expect(user.name).toBe('Іван');
});