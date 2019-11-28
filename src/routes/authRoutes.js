const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

function router(nav) {
  const {
    signUp,
    getSignUp,
    signIn,
    authenticate,
    sessionMiddleware,
    getUser,
    getBooks,
  } = authController(nav);

  authRouter.route('/sign-up')
    .get(getSignUp)
    .post(signUp);

  authRouter.route('/sign-in')
    .get(signIn)
    .post(authenticate);

  authRouter.route('/profile')
    .all(sessionMiddleware)
    .get(getUser);

  authRouter.route('/profile/books')
    .all(sessionMiddleware)
    .get(getBooks);

  return authRouter;
}

module.exports = router;
