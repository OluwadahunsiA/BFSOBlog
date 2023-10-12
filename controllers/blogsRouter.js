const jwt = require('jsonwebtoken');

const blogsRouter = require('express').Router();

// this model was created by mongoose to be used to represent data that will be stored in the db
// and it is also an api for creating and retrieving data from the db
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

  response.status(200).json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  // you can get the user through the request obj because of the userExtractor middleware

  const currentUser = request.user;

  if (!currentUser.id) {
    return response.status(401).json({ error: 'invalid token' });
  }

  const user = await User.findById(currentUser.id);

  const body = request.body;

  try {
    const bodyMustHaveALikeValue = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user?.id,
    };
    const blog = new Blog(bodyMustHaveALikeValue);

    const savedBlog = await blog.save();

    if (user) {
      user.blogs = user.blogs.concat(savedBlog._id);

      await user.save();
    }

    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(400).end();
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;

  const findBlog = await Blog.findById(id);

  // get token from the request since a middleware has been added for this purpose;

  const token = request.token;

  // get the user from request as it was set in the userExtractor middleware

  const user = request.user;

  // verify token

  // const verifyToken = jwt.verify(token, process.env.SECRET);

  if (!user.id) {
    return response.status(404).json({ error: 'invalid token' });
  }

  // check if the id of the token is the same as the id of the user in the blog;

  if (user.id !== findBlog.user.toString()) {
    return response
      .status(404)
      .json({ error: 'You do not have the right access to do this' });
  } else {
    await Blog.findOneAndDelete({ _id: id });

    response.status(204).json({ success: 'blog successfully deleted' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;

  const oldValue = await Blog.findById(id);

  const body = request.body;

  await Blog.updateOne(oldValue, body);

  response.status(204).json(body);
});

module.exports = blogsRouter;
