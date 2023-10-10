const favoriteBlog = require('../utils/testing').favoriteBlog;

const blogs = [
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 14,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 15,
  },
];

describe('test favorite blog', () => {
  test('helper function must return favorite blog', () => {
    const result = favoriteBlog(blogs);

    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 15,
    });
  });
});
