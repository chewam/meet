var DataMgr = require('./DataManager'),
    EventMgr = require('./EventManager');

function UserManager() {
    console.log('---> Create UserManager');
};

UserManager.prototype.get = function(id, callback) {
    var query = 'SELECT id, login, email, pic FROM user WHERE id = ?';

    DataMgr.client.query(query, [id], function(err, results, fields) {
        console.log('GET USER', results[0]);
        callback.call(this, results[0]);
    });
};

UserManager.prototype.create = function(data, callback) {
    var me = this,
        query = 'INSERT INTO user '
        + 'SET gender = ?, pic = ?, login = ?, password = ?, country = ?, city = ?, email = ?, zipcode = ?, range1 = ?, range2 = ?';

    DataMgr.client.query(query,
        [data.gender, data.pic, data.login, data.password, data.country, data.city, data.email, data.zipcode, data.range1, data.range2],
        function(err, info) {
            me.get(info.insertId, callback);
        }
    );
};

UserManager.prototype.update = function(user, data, callback) {
    // var doUpdate = function(error, user) {
    //     for (var key in data) {
    //         user.set(key, data[key]);
    //     }
    //     user.save(callback);
    // };
    // if (typeof user === 'string') {
    //     this.get(user, doUpdate);
    // } else {
    //     doUpdate(undefined, user);
    // }    
};

UserManager.prototype.remove = function(user, callback) {
    // var doRemove = function(error, user) {
    //     user.remove(callback);
    // };
    // if (typeof user === 'string') {
    //     this.get(user, doRemove);
    // } else {
    //     doRemove(undefined, user);
    // }
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
    var query = 'SELECT id, login, password, email, pic, '
        + '(SELECT COUNT(*) FROM flash WHERE receiver = 278) AS flashed, '
        + '(SELECT COUNT(*) FROM visit WHERE receiver = 278) AS visited, '
        + '(SELECT COUNT(*) FROM save WHERE receiver = 278) AS saved '
        + 'FROM user';

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
};

UserManager.prototype.save = function(emitter, receiver, callback) {
    var query = 'INSERT INTO save SET emitter = ?, receiver = ?';

    DataMgr.client.query(query, [emitter, receiver], function(err, info) {
        callback.call(this, info.insertId);
    });
};

UserManager.prototype.write = function(emitter, receiver, data, callback) {
    var query = 'INSERT INTO message SET emitter = ?, receiver = ?, message = ?';

    DataMgr.client.query(query, [emitter, receiver, data.message], function(err, info) {
        callback.call(this, info.insertId);
    });
};

UserManager.prototype.flash = function(emitter, receiver, callback) {
    var query = 'INSERT INTO flash SET emitter = ?, receiver = ?';

    DataMgr.client.query(query, [emitter, receiver], function(err, info) {
        callback.call(this, info.insertId);
    });
};

UserManager.prototype.visit = function(emitter, receiver, callback) {
    var query = 'INSERT INTO visit SET emitter = ?, receiver = ?';

    DataMgr.client.query(query, [emitter, receiver], function(err, info) {
        callback.call(this, info.insertId);
    });

    // EventMgr.emit(receiver, 'visit', {
    //     id: user._id,
    //     pic: user.pic,
    //     login: user.login,
    //     gender: user.gender,
    //     zipcode: user.zipcode
    // });
};

UserManager.prototype.find = function(id, params, callback) {
    var queries = {
        count: 'SELECT COUNT(*) AS total FROM user WHERE gender = ?',
        select: 'SELECT id, login, email, pic, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user WHERE gender = ?'
    };

    this.list(queries, ['f'], params, callback);
};

UserManager.prototype.getFlashed = function(id, params, callback) {
    var queries = {
        count: 'SELECT count(*) AS total FROM flash WHERE emitter = ?',
        select: 'SELECT id, login, email, pic, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user WHERE id IN (SELECT receiver FROM flash WHERE emitter = ?)'
    };

    this.list(queries, [id], params, callback);
};

UserManager.prototype.getFlashedBy = function(id, params, callback) {
    var queries = {
        count: 'SELECT count(*) AS total FROM flash WHERE receiver = ?',
        select: 'SELECT id, login, email, pic, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user WHERE id IN (SELECT emitter FROM flash WHERE receiver = ?)'
    };

    this.list(queries, [id], params, callback);
};

UserManager.prototype.getVisited = function(id, params, callback) {
    var queries = {
        count: 'SELECT count(*) AS total FROM visit WHERE emitter = ?',
        select: 'SELECT id, login, email, pic, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user WHERE id IN (SELECT receiver FROM visit WHERE emitter = ?)'
    };

    this.list(queries, [id], params, callback);
};

UserManager.prototype.getVisitedBy = function(id, params, callback) {
    var queries = {
        count: 'SELECT count(*) AS total FROM visit WHERE receiver = ?',
        select: 'SELECT id, login, email, pic, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user WHERE id IN (SELECT emitter FROM visit WHERE receiver = ?)'
    };

    this.list(queries, [id], params, callback);
};

UserManager.prototype.getSaved = function(id, params, callback) {
    var queries = {
        count: 'SELECT count(*) AS total FROM save WHERE emitter = ?',
        select: 'SELECT id, login, email, pic, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user WHERE id IN (SELECT receiver FROM save WHERE emitter = ?)'
    };

    this.list(queries, [id], params, callback);
};

UserManager.prototype.getSavedBy = function(id, params, callback) {
    var queries = {
        count: 'SELECT count(*) AS total FROM save WHERE receiver = ?',
        select: 'SELECT id, login, email, pic, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user WHERE id IN (SELECT emitter FROM save WHERE receiver = ?)'
    };

    this.list(queries, [id], params, callback);
};

UserManager.prototype.getMessages = function(id, params, callback) {
    var queries = {
        count: 'SELECT count(*) AS total '
            + 'FROM user, message WHERE user.id = IF(message.emitter = ?, message.receiver, message.emitter)',

        select: 'SELECT user.id, user.login, user.email, user.pic, message.id AS messageId, '
            + 'message.message, message.emitter, message.receiver, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user, message WHERE user.id = IF(message.emitter = ?, message.receiver, message.emitter)'
    };

    this.list(queries, [id], params, callback);

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

    // this.get(id, function(error, user) {
    //     if (!error) {
    //         var doc,
    //             threads = user.get('threads'),
    //             Thread = DataMgr.getModel('Thread');
    //             query = Thread.find({});
    //             
    //         query.where('_id').in(threads);
    //         query.skip(params.pageSize * (params.pageIndex - 1));
    //         query.limit(params.pageSize).exec(function(error, docs) {
    //             query = Thread.find({});
    //             query.where('_id').in(threads);
    //             query.count(function(error, count) {
    //                 callback.call(this, error, docs, count);
    //             });
    //         });
    //     } else {
    //         callback.call(this, error, user);
    //     }
    // });
};

module.exports = new UserManager();
