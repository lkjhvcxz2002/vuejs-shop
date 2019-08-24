var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// 访问静态资源
app.use(express.static(path.resolve(__dirname, '../dist')));

// 访问单页
app.get('*', function (req, res) {
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