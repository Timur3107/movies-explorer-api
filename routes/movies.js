const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const {
  createFilmValidate,
  deleteFilmValidate,
} = require('../middlewares/celebrateValidators');

router.get('/movies', auth, getMovies);
router.post('/movies', createFilmValidate, auth, createMovie);
router.delete('/movies/:filmId', deleteFilmValidate, auth, deleteMovie);

module.exports = router;
