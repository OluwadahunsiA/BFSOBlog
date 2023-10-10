const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

const testApi = supertest(app);

const sampleUsers = [
  {
    name: 'Jones',
    username: 'Jones',
    password: '23423423',
  },
];

beforeEach(async () => {
  await User.deleteMany({});

  console.log('user cleared');

  const users = sampleUsers.map((user) => new User(user));

  const promiseArray = users.map((user) => user.save());

  await Promise.all(promiseArray);

  console.log('done');
}, 5000);

describe('test users', () => {
  test('user has a unique username', async () => {
    const newUser = { name: 'Jones', username: 'Jones', password: '23423423' };

    try {
      await testApi.post('/api/users').send(newUser).expect(404);
    } catch (error) {
      console.log(error);
    }

    const allUsers = await User.find({});

    expect(allUsers.length).toBe(sampleUsers.length);
  });

  test('unique user has a password length > 3', async () => {
    const newUser = {
      name: 'ShortPassword',
      username: 'shortpassword',
      password: '34',
    };

    try {
      await testApi.post('/api/users').send(newUser).expect(404);
    } catch (error) {
      console.log(error);
    }

    const allUsers = await User.find({});

    expect(allUsers.length).toBe(sampleUsers.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
