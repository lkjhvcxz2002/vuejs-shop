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

    addScore: function(req, res) {
        var self = this;
        var key = req.params.key;
        var fbId = req.params.fbId;
        var md5Str = req.params.md5Str
        var md5FbId = md5(fbId + new Date().getMinutes() + "_+123");
        // console.log(md5Str);
        // console.log(md5FbId);
        if(md5Str != (md5FbId.substring(6,7) + md5FbId + md5FbId.substring(2,4))) {res.send("Invalid Token!!"); return;}

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
        var pa = req.params.pa;
        if(pa != "48791211") {res.send("Yo, update data success"); return;}

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
    updateOneScore: function(req, res) {
        var self = this;
        var item = req.body;    
        var pa = req.params.pa;
        if(pa != "48791211") {res.send("Yo, update data success"); return;}

        console.log(item);
        var key = item["key"];
        var querySpec = {
            query: 'SELECT * FROM c WHERE c.key = @key',
            parameters: [{
                name: '@key',
                value: key
            }]
        };

        self.taskDao.find(querySpec, function (err, items) {
            if (err) {
                console.log(JSON.stringify(err));
                throw (err);
            }

            let _oriItem = items[0];
            if(_oriItem) {
                _oriItem["scoreMap"] = item["scoreMap"];
                _oriItem["reviewersScore"] = item["reviewersScore"];
                self.taskDao.updateItem(_oriItem, function (err) {
                    if (err) {
                        console.log(JSON.stringify(err));
                        throw (err);
                    }
        
                    res.send("Update one score success");
                });
            }
        });
    },
    updateData: function(req, res) {
        var self = this;
        var picArr = [1, 2];
        var items = req.body;    
        var pa = req.params.pa;
        if(pa != "48791211") {res.send("Yo, update data success"); return;}

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
    },
    getScoreList: function(req, res) {
        var self = this;
        var querySpec = {
            query: 'SELECT c.accountId, c.count, c["group"], c.key, c.thumb, c.userName, c.scoreMap FROM c'
        };

        self.taskDao.find(querySpec, function (err, items) {
            if (err) {
                console.log(JSON.stringify(err));
                throw (err);
            }

            res.send(items);
        });
    },
    getScore: function(req, res) {
        var self = this;
        var id = req.params.key;
        var querySpec = {};
        
        if(id) {
            var querySpec = {
                query: 'SELECT * FROM c WHERE c.key = @key',
                parameters: [{
                    name: '@key',
                    value: id
                }]
            };
        } else {
            var querySpec = {
                query: 'SELECT * FROM c'
            };
        }

        self.taskDao.find(querySpec, function (err, items) {
            if (err) {
                console.log(JSON.stringify(err));
                throw (err);
            }

            let _result = items[0];
            if(!_result){ res.send("404"); return;}
            let result = {
                "id": _result.accountId,
                "key": _result.key,
                "count": _result.count,
                "group": _result.group,
                "thumb": _result.thumb,
                "pic": _result.pic,
                "name": _result.userName,
                "scoreMap": _result.scoreMap
            }

            res.send(result);
        });
    }
};