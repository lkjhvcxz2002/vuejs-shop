var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function TaskList(taskDao) {
  this.taskDao = taskDao;
}

function getRecordJson() {
    return {
        "key": null,
        "likedList": [],
        "count": 0
    }
}

module.exports = TaskList;
TaskList.prototype = {
    showTasks: function (req, res) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.completed=@completed',
            parameters: [{
                name: '@completed',
                value: false
            }]
        };

        self.taskDao.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }

            res.render('index', {
                title: 'My ToDo List ',
                tasks: items
            });
        });
    },

    addTask: function (req, res) {
        var self = this;
        var item = req.body;

        self.taskDao.addItem(item, function (err) {
            if (err) {
                throw (err);
            }

            res.redirect('/');
        });
    },

    completeTask: function (req, res) {
        var self = this;
        var completedTasks = Object.keys(req.body);

        async.forEach(completedTasks, function taskIterator(completedTask, callback) {
            self.taskDao.updateItem(completedTask, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }, function goHome(err) {
            if (err) {
                throw err;
            } else {
                res.redirect('/');
            }
        });
    },

    getScore: function(req, res) {
        var self = this;
        var fbId = req.params.fbId;

        var querySpec = {
            query: 'SELECT items FROM items JOIN likedList IN items.likedList WHERE likedList IN (@fbId)',
            parameters: [{
                name: '@fbId',
                value: fbId
            }]
        };

        self.taskDao.find(querySpec, function (err, items) {
            if (err) {
                console.log(JSON.stringify(err));
                throw (err);
            }

            var objArr = items.map(o => {return o.items});
            res.send(objArr.map(o => {return o["key"]}));
        });
    },

    addScore: function(req, res) {
        var self = this;
        var key = req.params.key;
        var fbId = req.params.fbId;

        var querySpec = {
            query: 'SELECT * FROM root r WHERE r.key=@key',
            parameters: [{
                name: '@key',
                value: key
            }]
        };

        self.taskDao.find(querySpec, function (err, items) {
            // Has record
            if(items && items.length > 0) {
                let item = items[0]
                console.log(JSON.stringify(item))
                // Already Liked
                if(item["likedList"].indexOf(fbId.toString()) != -1) {
                    console.log("hi");
                    res.send(["Already Liked"]);
                } 
                // Not Liked yet
                else {
                    item["likedList"].push(fbId);    
                    item["count"] = ++item["count"];
                    self.taskDao.updateItem(item, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            res.send([item["count"]]);    
                        }
                    });
                }
            } 
            // No record
            else {
                let item = getRecordJson();
                item["key"] = key;
                item["count"] = ++item["count"];
                item["likedList"] = [fbId];

                self.taskDao.addItem(item, function (err) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        throw (err);
                    }

                    res.send(["Insert item success"]);
                });
            }
        });
    }, 

    scoreAll: function(req, res) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM root r',
        };

        self.taskDao.find(querySpec, function (err, items) {
            if (err) {
                console.log(JSON.stringify(err));
                throw (err);
            }

            items = items.map(o => {
                return {
                    "key": o["key"],
                    "count": o["count"]
                }
            });

            res.send(items);
        });
    }
};