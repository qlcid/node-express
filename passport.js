const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;   // google login api

var googleCredentials = require('./config/google.json');
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
    }));

    // google login api
    passport.use(new GoogleStrategy({
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0]
    }, function(accessToken, refreshToken, profile, done) {
        console.log('GoogleStrategy', accessToken, refreshToken, profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }));
};