var DataMgr = require('./DataManager'),
    EventMgr = require('./EventManager');

function UserManager() {
    console.log('---> Create UserManager');
};

UserManager.prototype.get = function(id, callback) {
    var query = 'SELECT id, login, email, pic FROM users WHERE id = ?';

    DataMgr.client.query(query, [id], function(err, results, fields) {
        console.log('GET USER', results[0]);
        callback.call(this, results[0]);
    });
};

UserManager.prototype.create = function(data, callback) {
    var me = this,
        query = 'INSERT INTO users '
        + 'SET gender = ?, pic = ?, login = ?, password = ?, country = ?, city = ?, email = ?, zipcode = ?, range1 = ?, range2 = ?';

    DataMgr.client.query(query,
        [data.gender, data.pic, data.login, data.password, data.country, data.city, data.email, data.zipcode, data.range1, data.range2],
        function(err, info) {
            me.get(info.insertId, callback);
        }
    );
};

UserManager.prototype.update = function(user, data, callback) {
    var doUpdate = function(error, user) {
        for (var key in data) {
            user.set(key, data[key]);
        }
        user.save(callback);
    };
    if (typeof user === 'string') {
        this.get(user, doUpdate);
    } else {
        doUpdate(undefined, user);
    }    
};

UserManager.prototype.remove = function(user, callback) {
    var doRemove = function(error, user) {
        user.remove(callback);
    };
    if (typeof user === 'string') {
        this.get(user, doRemove);
    } else {
        doRemove(undefined, user);
    }
};

UserManager.prototype.find = function(user, params, callback) {

    var queries = {
        count: 'SELECT COUNT(*) AS total FROM users WHERE gender = ?',
        select: 'SELECT id, login, email, pic FROM users WHERE gender = ?'
    };

    this.list(queries, ['f'], params, callback);

    // var limit = 10,
    //     start = (params.pageIndex - 1) * 10,
    //     count = 'SELECT COUNT(*) AS total FROM users WHERE gender = ?',
    //     query = 'SELECT id, login, email, pic FROM users WHERE gender = ? LIMIT ?, ?';
    // 
    // DataMgr.client.query(query, ['f', start, limit], function(err, results, fields) {
    //     DataMgr.client.query(count, ['f'], function(err, count) {
    //         callback.call(this, results, count[0].total);
    //     });
    // });
    // var query, baseParams = {},
    //     User = DataMgr.getModel('User');
    // 
    // if (user) {
    //     baseParams.gender = user.gender === 'm' ? 'f' : 'm';
    // }
    // 
    // query = User.find(baseParams);
    // 
    // query.skip(params.pageSize * (params.pageIndex - 1));
    // query.limit(params.pageSize).exec(function(error, docs) {
    //     query = User.find(baseParams);
    //     query.count(function(error, count) {
    //         callback.call(this, error, docs, count);
    //     });
    // });
};

UserManager.prototype.list = function(queries, values, params, callback) {
    var limit = 10,
        start = (params.pageIndex - 1) * 10,
        limitedValues = values.concat([start, limit]),
        count = queries.count,
        query = queries.select + ' LIMIT ?, ?';

    limitedValues = values.concat([start, limit]);

    DataMgr.client.query(query, limitedValues, function(err, results, fields) {
        DataMgr.client.query(count, values, function(err, count) {
            callback.call(this, results, count[0].total);
        });
    });
};

UserManager.prototype.login = function(data, callback) {
    var query = 'SELECT id, login, password, email, pic FROM users';

    DataMgr.client.query(query, function(err, results, fields) {
        for (var i = 0, l = results.length; i < l; i++) {
            if (results[i].login === data.login && results[i].password === data.password) {
                delete results[i].password;
                callback.call(this, results[i]);
                return;
            }
        }
        callback.call(this);
    });

    // var User = DataMgr.getModel('User');
    // User.find({}, function (error, docs) {
    //     var user = null;
    //     if (!error) {
    //         docs.forEach(function(doc) {
    //             if (doc.get('login') === data.login && doc.get('password') === data.password) {
    //                 user = doc;
    //                 return false;
    //             }
    //         });
    //         callback.call(this, error, user);
    //     } else {
    //         callback.call(this, error);
    //     }
    // });
};

UserManager.prototype.flash = function(emitter, receiver, callback) {
    var query = 'INSERT INTO flash SET emitter = ?, receiver = ?';
    console.log('FLASH', emitter, receiver);
    DataMgr.client.query(query, [emitter, receiver], function(err, results, fields) {
        callback.call(this);
    });

    // var dt = new Date();
    // this.get(receiver, function(error, user) {
    //     if (!error) {
    //         user.flashedBy.push({
    //             user: emitter,
    //             date: dt
    //         });
    //         user.save();
    //     }
    // });
    // this.get(emitter, function(error, user) {
    //     if (!error) {
    //         user.flashed.push({
    //             user: receiver,
    //             date: dt
    //         });
    //         user.save(callback);
    //         EventMgr.emit(receiver, 'flash', {
    //             id: user._id,
    //             pic: user.pic,
    //             login: user.login,
    //             gender: user.gender,
    //             zipcode: user.zipcode
    //         });
    //     } else {
    //         callback.call(this, error, user);
    //     }
    // });
};

UserManager.prototype.getFlashed = function(id, params, callback) {

    var queries = {
        count: 'SELECT count(*) AS total FROM flash WHERE emitter = ?',
        select: 'SELECT id, login, email, pic FROM users WHERE id IN (SELECT receiver FROM flash WHERE emitter = ?)'
    };

    this.list(queries, [id], params, callback);

    // this.get(id, function(error, user) {
    //     if (!error) {
    //         var flashed = [],
    //             User = DataMgr.getModel('User'),
    //             query = User.find({});
    // 
    //         for (var i = 0, l = user.flashed.length; i < l; i++) {
    //             flashed.push(user.flashed[i].user);
    //         }
    // 
    //         query.where('_id').in(flashed);
    //         query.skip(params.pageSize * (params.pageIndex - 1));
    //         query.limit(params.pageSize).exec(function(error, docs) {
    //             query = User.find({});
    //             query.where('_id').in(flashed);
    //             query.count(function(error, count) {
    //                 callback.call(this, error, docs, count);
    //             });
    //         });
    //     }
    // });

};

UserManager.prototype.getFlashedBy = function(id, params, callback) {

    var queries = {
        count: 'SELECT count(*) AS total FROM flash WHERE receiver = ?',
        select: 'SELECT id, login, email, pic FROM users WHERE id IN (SELECT emitter FROM flash WHERE receiver = ?)'
    };

    this.list(queries, [id], params, callback);

    // this.get(id, function(error, user) {
    //     if (!error) {
    //         var flashed = [],
    //             User = DataMgr.getModel('User'),
    //             query = User.find({});
    // 
    //         for (var i = 0, l = user.flashedBy.length; i < l; i++) {
    //             flashed.push(user.flashedBy[i].user);
    //         }
    // 
    //         query.where('_id').in(flashed);
    //         query.skip(params.pageSize * (params.pageIndex - 1));
    //         query.limit(params.pageSize).exec(function(error, docs) {
    //             query = User.find({});
    //             query.where('_id').in(flashed);
    //             query.count(function(error, count) {
    //                 callback.call(this, error, docs, count);
    //             });
    //         });
    //     }
    // });

};

UserManager.prototype.visit = function(emitter, receiver, callback) {
    var query = 'INSERT INTO visit SET emitter = ?, receiver = ?';
    console.log('VISIT', emitter, receiver);
    DataMgr.client.query(query, [emitter, receiver], function(err, results, fields) {
        callback.call(this);
    });
    // var dt = new Date();
    // this.get(receiver, function(error, user) {
    //     if (!error) {
    //         user.visitedBy.push({
    //             user: emitter,
    //             date: dt
    //         });
    //         user.save();
    //     }
    // });
    // this.get(emitter, function(error, user) {
    //     if (!error) {
    //         user.visited.push({
    //             user: receiver,
    //             date: dt
    //         });
    //         user.save(callback);
    //         EventMgr.emit(receiver, 'visit', {
    //             id: user._id,
    //             pic: user.pic,
    //             login: user.login,
    //             gender: user.gender,
    //             zipcode: user.zipcode
    //         });
    //     } else {
    //         callback.call(this, error, user);
    //     }
    // });
};

UserManager.prototype.getVisited = function(id, params, callback) {

    var queries = {
        count: 'SELECT count(*) AS total FROM visit WHERE emitter = ?',
        select: 'SELECT id, login, email, pic FROM users WHERE id IN (SELECT receiver FROM visit WHERE emitter = ?)'
    };

    this.list(queries, [id], params, callback);

    // this.get(id, function(error, user) {
    //     if (!error) {
    //         var visited = [],
    //             User = DataMgr.getModel('User'),
    //             query = User.find({});
    // 
    //         for (var i = 0, l = user.visited.length; i < l; i++) {
    //             visited.push(user.visited[i].user);
    //         }
    // 
    //         query.where('_id').in(visited);
    //         query.skip(params.pageSize * (params.pageIndex - 1));
    //         query.limit(params.pageSize).exec(function(error, docs) {
    //             query = User.find({});
    //             query.where('_id').in(visited);
    //             query.count(function(error, count) {
    //                 callback.call(this, error, docs, count);
    //             });
    //         });
    //     }
    // });

};

UserManager.prototype.getVisitedBy = function(id, params, callback) {

    var queries = {
        count: 'SELECT count(*) AS total FROM visit WHERE receiver = ?',
        select: 'SELECT id, login, email, pic FROM users WHERE id IN (SELECT emitter FROM visit WHERE receiver = ?)'
    };

    this.list(queries, [id], params, callback);

    // this.get(id, function(error, user) {
    //     if (!error) {
    //         var visited = [],
    //             User = DataMgr.getModel('User'),
    //             query = User.find({});
    // 
    //         for (var i = 0, l = user.visitedBy.length; i < l; i++) {
    //             visited.push(user.visitedBy[i].user);
    //         }
    // 
    //         query.where('_id').in(visited);
    //         query.skip(params.pageSize * (params.pageIndex - 1));
    //         query.limit(params.pageSize).exec(function(error, docs) {
    //             query = User.find({});
    //             query.where('_id').in(visited);
    //             query.count(function(error, count) {
    //                 callback.call(this, error, docs, count);
    //             });
    //         });
    //     }
    // });

};

UserManager.prototype.getSaved = function(id, params, callback) {

    var queries = {
        count: 'SELECT count(*) AS total FROM save WHERE emitter = ?',
        select: 'SELECT id, login, email, pic FROM users WHERE id IN (SELECT receiver FROM save WHERE emitter = ?)'
    };

    this.list(queries, [id], params, callback);

    // this.get(id, function(error, user) {
    //     if (!error) {
    //         var saved = [],
    //             User = DataMgr.getModel('User'),
    //             query = User.find({});
    // 
    //         for (var i = 0, l = user.saved.length; i < l; i++) {
    //             saved.push(user.saved[i].user);
    //         }
    // 
    //         query.where('_id').in(saved);
    //         query.skip(params.pageSize * (params.pageIndex - 1));
    //         query.limit(params.pageSize).exec(function(error, docs) {
    //             query = User.find({});
    //             query.where('_id').in(saved);
    //             query.count(function(error, count) {
    //                 callback.call(this, error, docs, count);
    //             });
    //         });
    //     }
    // });

};

UserManager.prototype.getSavedBy = function(id, params, callback) {

    var queries = {
        count: 'SELECT count(*) AS total FROM save WHERE receiver = ?',
        select: 'SELECT id, login, email, pic FROM users WHERE id IN (SELECT emitter FROM save WHERE receiver = ?)'
    };

    this.list(queries, [id], params, callback);

    // this.get(id, function(error, user) {
    //     if (!error) {
    //         var saved = [],
    //             User = DataMgr.getModel('User'),
    //             query = User.find({});
    // 
    //         for (var i = 0, l = user.savedBy.length; i < l; i++) {
    //             saved.push(user.savedBy[i].user);
    //         }
    // 
    //         query.where('_id').in(saved);
    //         query.skip(params.pageSize * (params.pageIndex - 1));
    //         query.limit(params.pageSize).exec(function(error, docs) {
    //             query = User.find({});
    //             query.where('_id').in(saved);
    //             query.count(function(error, count) {
    //                 callback.call(this, error, docs, count);
    //             });
    //         });
    //     }
    // });

};

UserManager.prototype.save = function(emitter, receiver, callback) {
    var query = 'INSERT INTO save SET emitter = ?, receiver = ?';
    console.log('SAVE', emitter, receiver);
    DataMgr.client.query(query, [emitter, receiver], function(err, results, fields) {
        callback.call(this);
    });
    // var dt = new Date();
    // this.get(receiver, function(error, user) {
    //     if (!error) {
    //         user.savedBy.push({
    //             user: emitter,
    //             date: dt
    //         });
    //         user.save();
    //     }
    // });
    // this.get(emitter, function(error, user) {
    //     if (!error) {
    //         user.saved.push({
    //             user: receiver,
    //             date: dt
    //         });
    //         user.save(callback);
    //     } else {
    //         callback.call(this, error, user);
    //     }
    // });
};

UserManager.prototype.write = function(emitter, receiver, data, callback) {
    // var dt = new Date();
    // this.get(receiver, function(error, user) {
    //     if (!error) {
    //         user.messages.push({
    //             emitter: emitter,
    //             receiver: receiver,
    //             title: data.title,
    //             message: data.message
    //         });
    //         user.save();
    //     }
    // });
    // this.get(emitter, function(error, user) {
    //     if (!error) {
    //         user.messages.push({
    //             emitter: emitter,
    //             receiver: receiver,
    //             title: data.title,
    //             message: data.message
    //         });
    //         user.save(callback);
    //     } else {
    //         callback.call(this, error, user);
    //     }
    // });
    var me = this,
        Thread = DataMgr.getModel('Thread'),
        thread = new Thread({
            users: [emitter, receiver],
            messages: [{
                emitter: emitter,
                receiver: receiver,
                title: data.title,
                message: data.message
            }]
        });
    
    thread.save(function(error, thread) {
        if (!error) {
            var id = thread.get('_id');
            me.get(receiver, function(error, user) {
                if (!error) {
                    user.threads.push(id);
                    user.save();
                }
            });
            me.get(emitter, function(error, user) {
                if (!error) {
                    user.threads.push(id);
                    user.save(callback);
                } else {
                    callback.call(this, error, user);
                }
            });
        } else {
            callback.call(this, error, thread);
        }
    });
};

UserManager.prototype.getMessages = function(id, params, callback) {
    // this.get(id, function(error, user) {
    //     if (!error) {
    //         var userId, message,
    //             store = [], messages = [],
    //             User = DataMgr.getModel('User'),
    //             query = User.find({});
    // 
    //         for (var i = 0, l = user.messages.length; i < l; i++) {
    //             message = user.messages[i];
    //             userId = id === message.emitter ? message.receiver : message.emitter;
    //             messages.push(userId);
    //             store[userId] = message;
    //         }
    // 
    //         query.where('_id').in(messages);
    //         query.skip(params.pageSize * (params.pageIndex - 1));
    //         query.limit(params.pageSize).exec(function(error, docs) {
    //             query = User.find({});
    //             query.where('_id').in(messages);
    //             query.count(function(error, count) {
    //                 for (var i = 0, l = docs.length; i < l; i++) {
    //                     docs[i].set('message', store[docs[i].get('_id')]);
    //                 }
    //                 console.log('DOCS', docs);
    //                 callback.call(this, error, docs, count);
    //             });
    //         });
    //     }
    // });

    this.get(id, function(error, user) {
        if (!error) {
            var doc,
                threads = user.get('threads'),
                Thread = DataMgr.getModel('Thread');
                query = Thread.find({});
                
            query.where('_id').in(threads);
            query.skip(params.pageSize * (params.pageIndex - 1));
            query.limit(params.pageSize).exec(function(error, docs) {
                query = Thread.find({});
                query.where('_id').in(threads);
                query.count(function(error, count) {
                    callback.call(this, error, docs, count);
                });
            });
        } else {
            callback.call(this, error, user);
        }
    });
};

module.exports = new UserManager();
