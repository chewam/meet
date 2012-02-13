var DataMgr = require('./DataManager'),
    EventMgr = require('./EventManager');

function UserManager() {
    console.log('---> Create UserManager');
};

UserManager.prototype.get = function(id, callback) {
    var User = DataMgr.getModel('User');
    User.findById(id, callback);
};

UserManager.prototype.create = function(data, callback) {
    var User = DataMgr.getModel('User');
    var user = new User(data);
    user.save(callback);
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
    var query, baseParams = {},
        User = DataMgr.getModel('User');

    if (user) {
        baseParams.gender = user.gender === 'm' ? 'f' : 'm';
    }

    query = User.find(baseParams);

    query.skip(params.pageSize * (params.pageIndex - 1));
    query.limit(params.pageSize).exec(function(error, docs) {
        query = User.find(baseParams);
        query.count(function(error, count) {
            callback.call(this, error, docs, count);
        });
    });
};

UserManager.prototype.login = function(data, callback) {
    var User = DataMgr.getModel('User');
    User.find({}, function (error, docs) {
        var user = null;
        if (!error) {
            docs.forEach(function(doc) {
                if (doc.get('login') === data.login && doc.get('password') === data.password) {
                    user = doc;
                    return false;
                }
            });
            callback.call(this, error, user);
        } else {
            callback.call(this, error);
        }
    });
};

UserManager.prototype.flash = function(emitter, receiver, callback) {
    var dt = new Date();
    this.get(receiver, function(error, user) {
        if (!error) {
            user.flashedBy.push({
                user: emitter,
                date: dt
            });
            user.save();
        }
    });
    this.get(emitter, function(error, user) {
        if (!error) {
            user.flashed.push({
                user: receiver,
                date: dt
            });
            user.save(callback);
        } else {
            callback.call(this, error, user);
        }
    });
};

UserManager.prototype.getFlashed = function(id, params, callback) {

    this.get(id, function(error, user) {
        if (!error) {
            var flashed = [],
                User = DataMgr.getModel('User'),
                query = User.find({});

            for (var i = 0, l = user.flashed.length; i < l; i++) {
                flashed.push(user.flashed[i].user);
            }

            query.where('_id').in(flashed);
            query.skip(params.pageSize * (params.pageIndex - 1));
            query.limit(params.pageSize).exec(function(error, docs) {
                query = User.find({});
                query.where('_id').in(flashed);
                query.count(function(error, count) {
                    callback.call(this, error, docs, count);
                });
            });
        }
    });

};

UserManager.prototype.getFlashedBy = function(id, params, callback) {

    this.get(id, function(error, user) {
        if (!error) {
            var flashed = [],
                User = DataMgr.getModel('User'),
                query = User.find({});

            for (var i = 0, l = user.flashedBy.length; i < l; i++) {
                flashed.push(user.flashedBy[i].user);
            }

            query.where('_id').in(flashed);
            query.skip(params.pageSize * (params.pageIndex - 1));
            query.limit(params.pageSize).exec(function(error, docs) {
                query = User.find({});
                query.where('_id').in(flashed);
                query.count(function(error, count) {
                    callback.call(this, error, docs, count);
                });
            });
        }
    });

};

UserManager.prototype.visit = function(emitter, receiver, callback) {
    var dt = new Date();
    this.get(receiver, function(error, user) {
        if (!error) {
            user.visitedBy.push({
                user: emitter,
                date: dt
            });
            user.save();
            EventMgr.emit(receiver, 'visit', {id: emitter});
        }
    });
    this.get(emitter, function(error, user) {
        if (!error) {
            user.visited.push({
                user: receiver,
                date: dt
            });
            user.save(callback);
        } else {
            callback.call(this, error, user);
        }
    });
};

UserManager.prototype.getVisited = function(id, params, callback) {

    this.get(id, function(error, user) {
        if (!error) {
            var visited = [],
                User = DataMgr.getModel('User'),
                query = User.find({});

            for (var i = 0, l = user.visited.length; i < l; i++) {
                visited.push(user.visited[i].user);
            }

            query.where('_id').in(visited);
            query.skip(params.pageSize * (params.pageIndex - 1));
            query.limit(params.pageSize).exec(function(error, docs) {
                query = User.find({});
                query.where('_id').in(visited);
                query.count(function(error, count) {
                    callback.call(this, error, docs, count);
                });
            });
        }
    });

};

UserManager.prototype.getVisitedBy = function(id, params, callback) {

    this.get(id, function(error, user) {
        if (!error) {
            var visited = [],
                User = DataMgr.getModel('User'),
                query = User.find({});

            for (var i = 0, l = user.visitedBy.length; i < l; i++) {
                visited.push(user.visitedBy[i].user);
            }

            query.where('_id').in(visited);
            query.skip(params.pageSize * (params.pageIndex - 1));
            query.limit(params.pageSize).exec(function(error, docs) {
                query = User.find({});
                query.where('_id').in(visited);
                query.count(function(error, count) {
                    callback.call(this, error, docs, count);
                });
            });
        }
    });

};

UserManager.prototype.getSaved = function(id, params, callback) {

    this.get(id, function(error, user) {
        if (!error) {
            var saved = [],
                User = DataMgr.getModel('User'),
                query = User.find({});

            for (var i = 0, l = user.saved.length; i < l; i++) {
                saved.push(user.saved[i].user);
            }

            query.where('_id').in(saved);
            query.skip(params.pageSize * (params.pageIndex - 1));
            query.limit(params.pageSize).exec(function(error, docs) {
                query = User.find({});
                query.where('_id').in(saved);
                query.count(function(error, count) {
                    callback.call(this, error, docs, count);
                });
            });
        }
    });

};

UserManager.prototype.getSavedBy = function(id, params, callback) {

    this.get(id, function(error, user) {
        if (!error) {
            var saved = [],
                User = DataMgr.getModel('User'),
                query = User.find({});

            for (var i = 0, l = user.savedBy.length; i < l; i++) {
                saved.push(user.savedBy[i].user);
            }

            query.where('_id').in(saved);
            query.skip(params.pageSize * (params.pageIndex - 1));
            query.limit(params.pageSize).exec(function(error, docs) {
                query = User.find({});
                query.where('_id').in(saved);
                query.count(function(error, count) {
                    callback.call(this, error, docs, count);
                });
            });
        }
    });

};

UserManager.prototype.save = function(emitter, receiver, callback) {
    var dt = new Date();
    this.get(receiver, function(error, user) {
        if (!error) {
            user.savedBy.push({
                user: emitter,
                date: dt
            });
            user.save();
        }
    });
    this.get(emitter, function(error, user) {
        if (!error) {
            user.saved.push({
                user: receiver,
                date: dt
            });
            user.save(callback);
        } else {
            callback.call(this, error, user);
        }
    });
};

UserManager.prototype.write = function(emitter, receiver, data, callback) {
    var me = this,
        Thread = DataMgr.getModel('Thread'),
        thread = new Thread({
            users: [emitter, receiver],
            message: [{
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
    this.get(id, function(error, user) {
        if (!error) {
            var threads = user.get('threads'),
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
