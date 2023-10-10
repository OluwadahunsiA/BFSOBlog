const dummy = (array) => {
  return 1;
};

const totalLikes = (likes) => {
  return likes.length === 0 ? 0 : likes.reduce((a, b) => a + b, 0);
};

const favoriteBlog = (blogs) => {
  const allLikes = blogs.map((blog) => blog.likes);
  const maxLike = Math.max(...allLikes);
  const favorite = blogs.find((blog) => blog.likes === maxLike);

  return favorite;
};

module.exports = { dummy, totalLikes, favoriteBlog };
