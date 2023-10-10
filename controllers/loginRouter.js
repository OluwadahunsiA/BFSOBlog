const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  // find the user in the database. FindOne returns null if user is not found;

  const user = await User.findOne({ username });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  // if the username and the password entered are correct, it is required to build a token for that
  // particular user.

  const tokenForUser = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(tokenForUser, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
