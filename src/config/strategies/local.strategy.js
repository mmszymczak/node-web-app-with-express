const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:local.strategy');
const mongoService = require('../../services/mongoService');

function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'userName',
      passwordField: 'password',
    }, (userName, password, done) => {
      (async function mongo() {
        try {
          const col = await mongoService.getCollection('users');
          const user = await col.findOne({ userName });

          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          debug(err.stack);
        }

        mongoService.closeConnection();
      }());
    },
  ));
}

module.exports = localStrategy;
