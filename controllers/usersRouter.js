const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

// for the purpose of saving the data that comes to this route to the MONGODB backend, it is necessary
// to have a mongoose model.

const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs');

  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length <= 3) {
    return response.status(404).json({
      error: 'Password must have more than 3 characters',
    });
  }

  // because it is not advisable to save passwords in the backend,
  // it is better to encrypt them and save them.

  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    response.status(404).json({
      error: 'username must be unique',
    });
  }
});

module.exports = usersRouter;
