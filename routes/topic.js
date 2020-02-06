const express = require('express');             // node framework를 사용해 코드를 간단히
const router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth');              // session login check

var { Topic } = require('../models');

router.get('/create', (req, res) => {
    Topic.findAll({
        attributes: ['topic_id', 'title'],
        raw: true
    }).then((results) => {
        var title = 'WEB - create';
        var list = template.list(results);
        var html = template.HTML(title, list, `
            <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
            `, '', auth.statusUI(req, res));
            res.send(html);
    }).catch(function(err) {
        console.log(err);
    });
  })
  
router.post('/create_process', (req, res) => {
    Topic.create({
        title: req.body.title,
        description: req.body.description,
        created: 2020-01-01
    }).then((Topic) => {
        console.log('topic_create_success');
        res.writeHead(302, { Location: `/topic/${Topic.topic_id}` });
        res.end();
    }).catch(function(err) {
        console.log(err);
    });
})
  
router.get('/update/:pageId', (req, res) => {
    Topic.findAll({
        attributes: ['topic_id', 'title'],
        raw: true
    }).then((results) => {
        Topic.findOne({
            attributes: ['topic_id', 'title', 'description'], 
            where: { topic_id: req.params.pageId }
        }).then((result) => {
            var title = result.title;
            var description = result.description;
            var list = template.list(results);
            var html = template.HTML(title, list,
            `
            <form action="/topic/update_process" method="post">
                <input type="hidden" name="id" value="${result.topic_id}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                <input type="submit">
                </p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update/${result.topic_id}">update</a>`,
            auth.statusUI(req, res));
            res.send(html);
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log(err);
    });
})
  
router.post('/update_process', (req, res) => {
    Topic.update({
        title: req.body.title,
        description: req.body.description
      }, {
        where: { topic_id: req.body.id }
    }).then(() => {
        console.log('topic_update_success');
        res.writeHead(302, { Location: `/topic/${req.body.id}` });
        res.end();
    }).catch(function(err) {
        console.log(err);
    });
})
  
router.post('/delete_process', (req, res) => {
    Topic.destroy({
        where: { topic_id: req.body.id }
    }).then(() => {
        console.log('topic_delete_success');
        res.redirect('/');
    }).catch(function(err) {
        console.log(err);
    });
})
  
router.get('/:pageId', (req, res, next) => {
    Topic.findAll({
        attributes: ['topic_id', 'title'],
        raw: true
    }).then((results) => {
        Topic.findOne({
            attributes: ['topic_id', 'title', 'description'], 
            where: { topic_id: req.params.pageId }
        }).then((result) => {
            var title = result.title;
            var description = result.description;
            var list = template.list(results);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                ` <a href="/topic/create">create</a>
                <a href="/topic/update/${result.topic_id}">update</a>
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${result.topic_id}">
                    <input type="submit" value="delete">
                </form>`, auth.statusUI(req, res));
            res.send(html);
        }).catch(function(err) {
            console.log(err);
        });
    }).catch(function(err) {
        console.log(err);
    });
})

module.exports = router;


/*
const express = require('express');             // node framework를 사용해 코드를 간단히
const router = express.Router();
var fs = require('fs');
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var { Topic } = require('../models');

router.get('/create', (req, res) => {
    fs.readdir('./data', function(err, filelist) {
        //var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list, `
            <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
        `, '');
        res.send(html);
    });
  })
  
router.post('/create_process', (req, res) => {
    var post = req.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
         res.writeHead(302, { Location: `/topic/${title}` });
         res.end();
    });
    // var body = '';
    // req.on('data', function(data) {
    //     body = body + data;
    // });
    // req.on('end', function() {
    //     var post = qs.parse(body);
    //     var title = post.title;
    //     var description = post.description;
    //     fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
    //       res.writeHead(302, { Location: `/?id=${title}` });
    //       res.end();
    //     })
    // });
})
  
router.get('/update/:pageId', (req, res) => {
    fs.readdir('./data', function(err, filelist) {
        var filteredId = path.parse(req.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            var title = req.params.pageId;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
            `
            <form action="/topic/update_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                <input type="submit">
                </p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
            );
            res.send(html);
        });
    });  
})
  
router.post('/update_process', (req, res) => {
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;

    fs.rename(`data/${id}`, `data/${title}`, function(err) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        res.writeHead(302, { Location: `/topic/${title}` });
        res.end();
        })
    });
})
  
router.post('/delete_process', (req, res) => {
    var post = req.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(err) {
      // res.writeHead(302, { Location: `/` });
      // res.end();
      res.redirect(`/`);
    });
})
  
router.get('/:pageId', (req, res, next) => {
    fs.readdir('./data', function(err, filelist) {
        var filteredId = path.parse(req.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            if (err) {
                next(err);
            } else {
            var title = req.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                </form>`
            );
            res.send(html);
            }
        });
    });
})

module.exports = router;
*/
