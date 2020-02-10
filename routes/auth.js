const express = require('express');             // node framework를 사용해 코드를 간단히
const router = express.Router();
var template = require('../lib/template.js');
var passport = require('passport');             // node middleware, passport

var { Topic } = require('../models');
var { User } = require('../models');

// login router
router.get('/login', (req, res) => {
    Topic.findAll({
        attributes: ['topic_id', 'title'],
        raw: true
    }).then((results) => {
        var title = 'WEB - login';
        var list = template.list(results);
        var html = template.HTML(title, list, `
            <form action="/auth/login_process" method="post">
                <p><input type="text" name="id" placeholder="id"></p>
                <p><input type="password" name="pwd" placeholder="password"></p>
                <p>
                <input type="submit" value="login">
                </p>
            </form>
            `, '');
        res.send(html);
    }).catch(function(err) {
        console.log(err);
    });
});

router.post('/login_process', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}));

// login with Google
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}));

// register router
router.get('/register', (req, res) => {
    Topic.findAll({
        attributes: ['topic_id', 'title'],
        raw: true
    }).then((results) => {
        var title = 'WEB - register';
        var list = template.list(results);
        var html = template.HTML(title, list, `
            <form action="/auth/register_process" method="post">
                <p><input type="text" name="id" placeholder="id" required></p>
                <p><input type="password" name="pwd" placeholder="password" required></p>
                <p><input type="text" name="name" placeholder="name" required></p>
                <p><input type="text" name="profile" placeholder="profile"></p>
                <p>
                <input type="submit" value="register">
                </p>
            </form>
            `, '');
            res.send(html);
    }).catch(function(err) {
        console.log(err);
    });
});

router.post('/register_process', (req, res) => {
    var id = req.body.id;
    var pwd = req.body.pwd;
    var name = req.body.name;
    var profile = req.body.profile;

    User.findOne({
        where: { user_id: id }
    }).then((user) => {
        if (!user) {                                // the id is not registered
            User.create({
                user_id: id,
                user_pwd: pwd,
                name: name,
                profile: profile
            }).then((user) => {
                console.log('register_success');
                req.login(user, function(err) {
                    return res.redirect('/');
                });
            });
        } else {                                    // the id is already registered
            console.log(user.user_id + " is already existing id!");
            if (user.google_id) {                   // register after login with Google
                User.update({
                    user_pwd: pwd,
                    profile: profile
                }, {
                    where: { user_id: id }
                }).then(() => {
                    req.login(user, function(err) {
                        return res.redirect('/');
                    });
                });
            } else {
                res.redirect('/auth/register');
            }
        }
    }).catch(function(err) {
        console.log(err);
    });
});

// logout router
router.get('/logout', (req, res) => {
    req.logout();
    req.session.save(function() {
        res.redirect('/');
    });
});
  
module.exports = router;