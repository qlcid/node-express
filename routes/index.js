const express = require('express');             // node framework를 사용해 코드를 간단히
const router = express.Router();
var template = require('../lib/template.js');

var { Topic } = require('../models');

// app.get is for routing
router.get('/', (req, res) => {
  Topic.findAll({
    attributes: ['topic_id', 'title'],
    raw: true
  }).then((result) => {
    console.log("0---------------" + result[0].topic_id);
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(result);
    var html = template.HTML(title, list,
        `
        <h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width: 300px; display: block; margin-top: 5px;">
        `,
        `<a href="/topic/create">create</a>`);
    res.send(html);
  }).catch(function(err) {
    console.log(err);
  });
    // fs.readdir('./data', function(err, filelist) {
    //     User.findOne({
    //       where: { user_id: 1 }
    //     }).then((user) => {        
    //       var title = 'Welcome';
    //       var description = 'Hello, Node.js';
    //       var list = template.list(filelist);
    //       var html = template.HTML(title, list,
    //           `
    //           <h2>${title} ${user.name}</h2>${description}
    //           <img src="/images/hello.jpg" style="width: 300px; display: block; margin-top: 5px;">
    //           `,
    //           `<a href="/topic/create">create</a>`
    //       );
    //       res.send(html);
    //     });
    // });
})
  
module.exports = router;