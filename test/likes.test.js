const totalLikes = require('../utils/testing').totalLikes;

describe('test likes', () => {
  test('total likes function', () => {
    const result = totalLikes([1, 2, 3, 4, 5]);

    expect(result).toBe(15);
  });

  test('total likes of one blog', () => {
    const result = totalLikes([5]);

    expect(result).toBe(5);
  });

  test('total likes of an empty array', () => {
    const result = totalLikes([]);

    expect(result).toBe(0);
  });
});
