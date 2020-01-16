const express = require('express');             // node framework를 사용해 코드를 간단히
const router = express.Router();
var fs = require('fs');
var template = require('../lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

router.get('/create', (req, res) => {
    fs.readdir('./data', function(err, filelist) {
        var title = 'WEB - create';
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
    /*
    var body = '';
    req.on('data', function(data) {
        body = body + data;
    });
    req.on('end', function() {
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
          res.writeHead(302, { Location: `/?id=${title}` });
          res.end();
        })
    });
    */
   var post = req.body;
   var title = post.title;
   var description = post.description;
   fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        res.writeHead(302, { Location: `/topic/${title}` });
        res.end();
   });
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
      /*
      res.writeHead(302, { Location: `/` });
      res.end();
      */
      res.redirect(`/`);
    })
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