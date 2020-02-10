const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

var { User } = require('./models');

module.exports = () => {
    passport.serializeUser(function(user, done) {               // session store에 저장
        console.log('serialize', user);
        done(null, user);
    });
      
    passport.deserializeUser(function(user, done) {             // session store에 저장된 식별자와 비교 후 정보를 가져옴
        console.log('deserialize', user);
        done(null, user);
    });

    passport.use(new LocalStrategy({
            usernameField: 'id',
            passwordField: 'pwd'
        }, (user_id, user_pwd, done) => {
            console.log('LocalStrategy', user_id, user_pwd);
            User.findOne({
                where: { user_id: user_id }
            }).then((user) => {
                console.log('user check');
                if (!user) {                
                  return done(null, false, { message: 'User Id does not exist.' });
                }
                if (user.dataValues.user_pwd != user_pwd) {
                  return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));

    var facebookCredentials = require('./config/facebook.json');
    passport.use(new FacebookStrategy(facebookCredentials,
      function(accessToken, refreshToken, profile, done) {
          console.log('FacebookStrategy', accessToken, refreshToken, profile);
        // User.findOrCreate(..., function(err, user) {
        //   if (err) { return done(err); }
        //   done(null, user);
        // });
        }
    ));
};