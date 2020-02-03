const express = require('express');             // node framework를 사용해 코드를 간단히
const router = express.Router();
var template = require('../lib/template.js');

var { Topic } = require('../models');
var { User } = require('../models');

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

router.post('/login_process', (req, res) => {
    User.findOne({
        attributes: ['user_pwd', 'name', 'profile'],
        where: { user_id: req.body.id }
    }).then((user) => {
        console.log('login_process_success');

        if (user == null || user.user_pwd != req.body.pwd) {
            req.session.is_logined = false;
            res.send("login fail!");
            console.log("login fail!");
        } else {
            req.session.is_logined = true;
            req.session.nickname = user.name;
            res.redirect(`/`);
            console.log('login success!');
        }
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        res.redirect(`/`);
    });
});
  
module.exports = router;