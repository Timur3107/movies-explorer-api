const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const IncrorrectDataError = require('../errors/IncrorrectDataError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  notFoundMessage, incorrectDataMessage, forbiddenMessage, removeFilmMessage,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((films) => {
      res.send({ data: films });
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  // owner: req.user._id
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((film) => {
      res.send({ data: film });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new IncrorrectDataError(incorrectDataMessage));
      }
      return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.filmId)
    .then((film) => {
      if (!film) {
        throw new NotFoundError(notFoundMessage);
      }
      if (req.user._id !== film.owner.toString()) {
        throw new ForbiddenError(forbiddenMessage);
      }
      return film.remove();
    })
    .then(() => {
      res.send({ message: removeFilmMessage });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new IncrorrectDataError(incorrectDataMessage));
      }
      return next(err);
    });
};
