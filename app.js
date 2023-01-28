require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./utils/rateLimiter');
const { errorHandler } = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { notFoundMessage } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const { DB_URL_DEV } = require('./utils/config');

const { PORT = 3001, NODE_ENV, DB_URL } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.use(cors);
app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? DB_URL : DB_URL_DEV);

// app.use('/', require('./routes/users'));
// app.use('/', require('./routes/movies'));
app.use(router);

app.use(() => {
  throw new NotFoundError(notFoundMessage);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);
app.listen(PORT);
