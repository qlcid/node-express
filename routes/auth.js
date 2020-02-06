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

// register router
router.get('/register', (req, res) => {
    Topic.findAll({
        attributes: ['topic_id', 'title'],
        raw: true
    }).then((results) => {
        var title = 'WEB - login';
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
        attributes: ['user_id'], 
        where: { user_id: id }
     }).then((result) => {
        if (!result) {
            User.create({
                user_id: id,
                user_pwd: pwd,
                name: name,
                profile: profile
            }).then(() => {
                console.log('register_success');
                res.redirect('/');
            });
        } else {
            console.log(result.user_id + "is already existing id!");
            res.redirect('/auth/register');
        }
     }).catch(function(err) {
        console.log(err);
     });
});

// logout router
router.get('/logout', (req, res) => {
    req.logout();
    req.session.save(function(){
        res.redirect('/');
    });
});
  
module.exports = router;