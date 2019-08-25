var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('./config');
var TaskList = require('./routes/tasklist');
var TaskDao = require('./models/taskDao');

var express = require('express');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());


// DB Related
//Todo App:
var docDbClient = new DocumentDBClient(config.host, {
  masterKey: config.authKey
});
var taskDao = new TaskDao(docDbClient, config.databaseId, config.collectionId);
var taskList = new TaskList(taskDao);
taskDao.init();
// api
app.get('/api/getScore/:fbId', taskList.getScore.bind(taskList));
app.get('/api/addScore/:key/:fbId', taskList.addScore.bind(taskList));
app.get('/api/scoreAll', taskList.scoreAll.bind(taskList));

// 访问静态资源
app.use(express.static(path.resolve(__dirname, '../dist')));

// 访问单页
app.get('/*', function (req, res) {
  var html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
  res.send(html);
});

// 监听
var port = '3000';
app.set('port', port);
app.listen(port, function () {
  console.log('success listen...' + port);
});

module.exports = app;