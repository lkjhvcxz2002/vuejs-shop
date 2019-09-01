const md5 = require('js-md5');
var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function TaskList(taskDao) {
  this.taskDao = taskDao;
}

function getRecordJson() {
    return {
        "accountId": null,
        "key": null,
        "likedList": [],
        "count": 0,
        "name": null,
        "fb": null,
        "group": null,
        "pic": null,
        "thumb": null
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
        var md5Str = req.params.md5Str
        var md5FbId = md5(fbId + new Date().getMinutes() + "_+123");
        // console.log(md5Str);
        // console.log(md5FbId);
        if(md5Str != (md5FbId + md5FbId.substring(2,4))) res.send("Invalid Token!!");    

        var querySpec = {
            query: 'SELECT * FROM r WHERE r.key=@key',
            parameters: [{
                name: '@key',
                value: key
            }]
        };

        self.taskDao.find(querySpec, function (err, items) {
            // Has record
            if(items && items.length > 0) {
                let item = items[0]
                console.log("Like " + item["key"] + ", from " + fbId);
                // Already Liked
                if(item["likedList"].indexOf(fbId.toString()) != -1) {
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

    delScore: function(req, res) {
        var self = this;
        var key = req.params.key;
        var fbId = req.params.fbId;

        var querySpec = {
            query: 'SELECT * FROM r WHERE r.key=@key',
            parameters: [{
                name: '@key',
                value: key
            }]
        };

        self.taskDao.find(querySpec, function (err, items) {
            // Has record
            if(items && items.length > 0) {
                let item = items[0]
                console.log("Remove Like " + item["key"] + ", from " + fbId);
                // Already Liked
                if(item["likedList"].indexOf(fbId.toString()) != -1) {
                    // Remove like
                    item["likedList"].splice(item["likedList"].indexOf(fbId.toString()), 1);
                    item["count"] = --item["count"];
                    self.taskDao.updateItem(item, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            res.send(["Remove like successful"]);    
                        }
                    });
                } 
                // Not Liked yet
                else {
                    res.send(["Not liked yet"]);
                }
            } 
            // No record
            else {
                res.send("No record found!");
            }
        });
    },

    scoreAll: function(req, res) {
        var self = this;

        var querySpec = {
            query: 'SELECT * FROM r',
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
    }, 

    getAll: function(req, res) {
        var self = this;
        var id = req.params.id;
        var querySpec = {};
        
        if(id) {
            var querySpec = {
                query: 'SELECT * FROM r WHERE r.accountId = @key',
                parameters: [{
                    name: '@key',
                    value: id
                }]
            };
        } else {
            var querySpec = {
                query: 'SELECT * FROM r'
            };
        }

        self.taskDao.find(querySpec, function (err, items) {
            if (err) {
                console.log(JSON.stringify(err));
                throw (err);
            }

            res.send(items);
        });
    }, 
    updateOne: function(req, res) {
        var self = this;
        var items = req.body;    

        async.forEach(items, function taskIterator(item, callback) {
            self.taskDao.updateItem(item, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }, function goHome(err) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.send("Update Data successful!!");
            }
        });
    },
    updateData: function(req, res) {
        var self = this;
        var picArr = [1, 2];
        var items = req.body;    

        var inserts = []
        items.forEach((item) => {
            if(item.name && item.pic1) {
                picArr.forEach((i) => {
                    var picName = "pic" + i.toString();
                    var thumbName = "thumb" + i.toString();
                    if(item[picName] && item[picName] != null) {
                        var jsonItem = getRecordJson();
                        jsonItem["accountId"] = item["id"].toString();
                        jsonItem["key"] = item["id"] + i.toString();
                        jsonItem["fb"] = item["fb"];
                        jsonItem["userName"] = item["name"];
                        jsonItem["pic"] = item[picName];
                        jsonItem["thumb"] = item[thumbName];
                        jsonItem["group"] = item["Group"];
                        console.log(jsonItem);
                        
                        inserts.push(jsonItem);
                    }
                })
            }
        });

        async.forEach(inserts, function taskIterator(insertItem, callback) {
            self.taskDao.addItem(insertItem, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }, function goHome(err) {
            if (err) {
                console.log(err);
                throw err;
            } else {
                res.send("Update Data successful!!");
            }
        });
    }
};