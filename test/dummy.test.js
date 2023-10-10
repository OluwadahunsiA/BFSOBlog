const dummy = require('../utils/testing').dummy;

test('dummy function returns 1', () => {
  const result = dummy([1, 2, 3, 4]);

  expect(result).toBe(1);
});
