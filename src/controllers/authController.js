const passport = require('passport');
const debug = require('debug')('app:authController');
const mongoService = require('../services/mongoService');

function authController(nav) {
  const authenticate = passport.authenticate('local', {
    successRedirect: '/auth/profile/books',
    failureRedirect: '/',
  });

  function sessionMiddleware(req, res, next) {
    if (req.user) next();
    else res.redirect('/auth/sign-in');
  }

  function getBooks(req, res) {
    (async function mongo() {
      try {
        const col = await mongoService.getCollection('books');
        const books = await col.find().toArray();

        res.render(
          'bookListView',
          {
            title: 'Library',
            nav,
            books,
          },
        );
      } catch (err) {
        debug(err.stack);
      }

      mongoService.closeConnection();
    }());
  }

  function signUp(req, res) {
    const { userName, password } = req.body;

    (async function mongo() {
      try {
        const col = mongoService.getCollection('users');
        const user = { userName, password };
        const result = await col.insertOne(user);

        req.login(result.ops[0], () => {
          res.redirect('/auth/profile');
        });
      } catch (err) {
        debug(err.stack);
      }

      mongoService.closeConnection();
    }());
  }

  function getSignUp(req, res) {
    res.render('signUp', {
      nav,
      title: 'Library',
    });
  }

  function signIn(req, res) {
    res.render('signIn', {
      nav,
      title: 'Library',
    });
  }

  function getUser(req, res) {
    res.json(req.user);
  }

  return {
    authenticate,
    getBooks,
    sessionMiddleware,
    signUp,
    getSignUp,
    signIn,
    getUser,
  };
}

module.exports = authController;
