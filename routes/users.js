const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUserMe, updateUser, createUser, login,
} = require('../controllers/users');

const {
  createUserValidate,
  updateUserValidate,
  loginValidate,
} = require('../middlewares/celebrateValidators');

router.get('/users/me', auth, getUserMe);
router.patch('/users/me', updateUserValidate, auth, updateUser);

router.post('/signup', createUserValidate, createUser);
router.post('/signin', loginValidate, login);

module.exports = router;
