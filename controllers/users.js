const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET_DEV } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const NotFoundError = require('../errors/NotFoundError');
const IncrorrectDataError = require('../errors/IncrorrectDataError');
const ConflictError = require('../errors/ConflictError');

const { notFoundMessage, incorrectDataMessage, conflictMessage } = require('../utils/constants');

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      throw new NotFoundError(notFoundMessage);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, email: req.body.email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncrorrectDataError(incorrectDataMessage));
      }
      if (err.name === 'CastError') {
        return next(new NotFoundError(notFoundMessage));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => (
      User.create({
        name, email, password: hash,
      })
    ))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          email: user.email,
          // _id: user._id,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(conflictMessage));
      }
      if (err.name === 'ValidationError') {
        return next(new IncrorrectDataError(incorrectDataMessage));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
      res.send({ token });
    })

    .catch(next);
};
