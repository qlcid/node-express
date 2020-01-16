const express = require('express');             // node framework를 사용해 코드를 간단히
const router = express.Router();
var template = require('../lib/template.js');
var fs = require('fs');

// app.get is for routing
router.get('/', (req, res) => {
    fs.readdir('./data', function(err, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `
            <h2>${title}</h2>${description}
            <img src="/images/hello.jpg" style="width: 300px; display: block; margin-top: 5px;">
            `,
            `<a href="/topic/create">create</a>`
        );
        res.send(html);
    });
})
  
module.exports = router;