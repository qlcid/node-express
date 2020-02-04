const express = require('express');             // node framework를 사용해 코드를 간단히
const app = express();
var bodyParser = require('body-parser');        // node middleware, request data의 body로부터 파라미터를 편리하게 추출
var compression = require('compression');       // node middleware, 데이터 압축
var session = require('express-session');       // node middleware, session
var FileStore = require('session-file-store')(session);       // node middleware, session을 파일에 저장

var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');
var authRouter = require('./routes/auth');

// db 연동
var sequelize = require('./models').sequelize;
sequelize.sync();

app.use(bodyParser.urlencoded({ extended: false }));    // request 객체에 body 속성을 만들어줌
app.use(compression());                                 // data 압축
app.use(express.static('public'));                      // static file, express.static('경로') 경로에 있는 파일을 url을 통해 접근 가능

// session
app.use(session({
  secret: 'asdf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

// route
app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

app.listen(3000, () => console.log('Example app listening on port 3000!'));