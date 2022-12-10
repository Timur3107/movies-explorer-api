require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { errorHandler } = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors);

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(requestLogger);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.use(() => {
  throw new NotFoundError('Такая страница не найдена!');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
app.listen(PORT);
