const jwt = require('jsonwebtoken');
const blogsRouter = require('./controllers/blogsRouter');
const usersRouter = require('./controllers/usersRouter');
const loginRouter = require('./controllers/loginRouter');
const mongoose = require('mongoose');
const config = require('./utils/config');

mongoose.set('strictQuery', false);

mongoose
  .connect(config.MONGODB)
  .then(() => {
    console.log('connected to mongo');
  })
  .catch((error) => console.log(error));

const express = require('express');

const cors = require('cors');

const tokenExtractor = (request, response, next) => {
  const BearerToken = request.headers['authorization'];

  if (BearerToken) {
    const token = BearerToken.split(' ')[1];

    request.token = token;
  } else {
    request.token = '';
  }

  next();
};

const userExtractor = (request, response, next) => {
  // find the user here.

  const token = request.token;

  const user = jwt.verify(token, process.env.SECRET);

  request.user = user;

  next();
};

const app = express();

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);
app.use(userExtractor);

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

module.exports = app;
