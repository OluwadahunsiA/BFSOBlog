const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const token = process.env.TEST_TOKEN;

const testApi = supertest(app);

const sampleBlogs = [
  {
    title: 'The first blog of the day',
    author: 'Anthony Nakamura',
    url: 'www.google.com',
    likes: 5,
    user: '652555cd2e22f695edfce413',
  },
  {
    title: 'The second blog of the day',
    author: 'Anthony Nakamura',
    url: 'www.google.com',
    likes: 6,
    user: '652555cd2e22f695edfce413',
  },
  {
    title: 'The third blog of the day',
    author: 'Anthony Nakamura',
    url: 'www.google.com',
    likes: 10,
    user: '652555cd2e22f695edfce413',
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  console.log('cleared');

  const blogObjects = sampleBlogs.map((blog) => new Blog(blog));

  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);

  console.log('done');
}, 5000);

test('that the correct amount of blog posts are returned in json format', async () => {
  const response = await testApi
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  console.log(response.body);

  const body = await response.body;

  expect(body).toHaveLength(sampleBlogs.length);
});

test('that the returned object has an id', async () => {
  const response = await testApi
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}` });

  const firstResponseId = response.body[0].id;

  expect(firstResponseId).toBeDefined();
});

test('that you can add a blog to the database', async () => {
  const newBlog = {
    title: 'The next blog of the day',
    author: 'Anthony Nakamura',
    url: 'www.google.com',
    likes: 110,
  };

  await testApi
    .post('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })
    .send(newBlog)
    .expect(201);

  const allBlogs = await Blog.find({});

  expect(allBlogs).toHaveLength(sampleBlogs.length + 1);
});

test('that a blog without title or author is not added to the database', async () => {
  const errorContent = {
    author: 'Aj Simpson',
    url: 'www.hifdf.com',
    likes: 340,
  };

  try {
    await testApi
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(errorContent)
      .expect(400);
  } catch (error) {
    console.log(error);
  }

  const allBlogs = await Blog.find({});

  expect(allBlogs).toHaveLength(sampleBlogs.length);
});

test('that blog must have a like value', async () => {
  const trialBody = {
    title: 'trial blog',
    author: 'trial author',
    url: 'trial.com',
    user: '6523e0ecb5678345f2b8fc49',
  };

  await testApi
    .post('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })
    .send(trialBody)
    .expect(201);

  const findLastPost = await Blog.find({});

  const lastPost = findLastPost[findLastPost.length - 1];

  expect(lastPost.likes).toBe(0);
});

test('that the delete route works', async () => {
  const allBlogs = await Blog.find({});

  const lastBlogId = allBlogs[allBlogs.length - 1]._id.toString();

  await testApi
    .delete(`/api/blogs/${lastBlogId}`)
    .set({ Authorization: `Bearer ${token}` })
    .expect(204);

  const remainingBlogs = await Blog.find({});

  expect(remainingBlogs.length).toBe(allBlogs.length - 1);
});

test('that a blog post is updated with the put request', async () => {
  const InterestedBlog = await Blog.find({});
  const idOfInterestedBlog = InterestedBlog[0]._id.toString();

  const updatedContent = { author: 'Kirill Bistrinko' };

  await testApi
    .put(`/api/blogs/${idOfInterestedBlog}`)
    .set({ Authorization: `Bearer ${token}` })
    .send(updatedContent)
    .expect(204);
});

afterAll(async () => {
  await mongoose.connection.close();
});
