var DataMgr = require('./DataManager');

function UserManager() {
    console.log('---> Create UserManager');
};

UserManager.prototype.defaultUserFields = [
    'id',
    'login',
    'pic',
    'gender',
    'status',
    'country',
    'city',
    'zipcode',
    'range1',
    'range2',
    'ethnicity',
    'height',
    'bodytype',
    'diet',
    'smokes',
    'drinks',
    'drugs',
    'religion',
    'sign',
    'education',
    'job',
    'income',
    'offspring',
    'pets',
    'speaks',
    'q1',
    'lat',
    'lng',
    'birthdate',
    'TIMESTAMPDIFF(YEAR, birthdate, NOW()) AS age'
];

UserManager.prototype.get = function(id, fields, callback) {
    if (!callback) {
        callback = fields;
        fields = ['id', 'login', 'email', 'pic'];
    }

    var query = 'SELECT '+ fields.join(', ') +' FROM user WHERE id = ?';

    DataMgr.client.query(query, [id], function(err, results, fields) {
        callback.call(this, results[0]);
    });
};

UserManager.prototype.getProfile = function(id, callback) {
    var fields = this.defaultUserFields.concat([
        '(SELECT COUNT(*) FROM save WHERE receiver = 278) AS saved',
        '(SELECT COUNT(*) FROM flash WHERE receiver = 278) AS flashed',
        '(SELECT COUNT(*) FROM visit WHERE receiver = 278) AS visited',
        '(SELECT GROUP_CONCAT(name) FROM pic WHERE userid = user.id GROUP BY userid) pics'
    ]);

    this.get(id, fields, callback);
};

UserManager.prototype.createUser = function(data, callback) {
    if (
        data.login && data.login.length &&
        data.email && data.email.length &&
        data.password && data.password.length &&
        data.password === data.password2 &&
        data.range1 && data.range1.length &&
        data.range2 && data.range2.length &&
        data['birthday-day'] && data['birthday-day'].length &&
        data['birthday-month'] && data['birthday-month'].length &&
        data['birthday-year'] && data['birthday-year'].length &&
        data.location && data.location.length
    ) {
        var me = this,
            geocoder = require('geocoder'),
            location = data.location.split('|'),
            birthdate = data['birthday-year'] + '-' + data['birthday-month'] + '-' + data['birthday-day'];

        geocoder.reverseGeocode(location[0], location[1], function (err, response) {
            if (!err) {
                var type,
                    result = response.results[0].address_components;
                for (var i = 0, l = result.length; i < l; i++) {
                    type = result[i].types;
                    if (type.indexOf('locality') !== -1) {
                        data.city = result[i].long_name;
                    } else if (type.indexOf('country') !== -1) {
                        data.country = result[i].long_name;
                    } else if (type.indexOf('postal_code') !== -1) {
                        data.zipcode = result[i].long_name;
                    }
                }

                if (
                    data.city && data.city.length &&
                    data.country && data.country.length &&
                    data.zipcode && data.zipcode.length
                ) {
                    var query = 'INSERT INTO user '
                        + 'SET cd = NOW(), status = ?, gender = ?, pic = ?, login = ?, password = ?, country = ?, city = ?, email = ?, zipcode = ?, range1 = ?, range2 = ?, lat = ?, lng = ?, birthdate = ?';

                    DataMgr.client.query(query,
                        [data.status, data.gender, data.pic, data.login, data.password, data.country, data.city, data.email, data.zipcode, data.range1, data.range2, location[0], location[1], birthdate],
                        function(err, info) {
                            me.get(info.insertId, callback);
                        }
                    );
                } else {
                    callback.call(this, false);
                }

            } else {
                callback.call(this, false);
            }
        });

    } else {
        callback.call(this, false);
    }

};

UserManager.prototype.update = function(id, data, callback) {
    var query,
        fields = [],
        values = [];

    for (var key in data) {
        fields.push(key + '=?');
        values.push(data[key]);
    }

    values.push(id);

    query = 'UPDATE user SET '+ fields.join(', ') +' WHERE id = ?';

    DataMgr.client.query(query, values, function(err, info) {
        callback.call(this);
    });
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

UserManager.prototype.login = function(data, callback) {
    // var query = 'SELECT id, login, password, email, pic, '
    //     + '(SELECT COUNT(*) FROM flash WHERE receiver = 278) AS flashed, '
    //     + '(SELECT COUNT(*) FROM visit WHERE receiver = 278) AS visited, '
    //     + '(SELECT COUNT(*) FROM save WHERE receiver = 278) AS saved '
    //     + 'FROM user';
    // 
    var user,
        me = this,
        query = 'SELECT id, login, password FROM user';    

    DataMgr.client.query(query, function(err, results, fields) {
        if (!err && results) {
            for (var i = 0, l = results.length; i < l; i++) {
                user = results[i];
                if (user.login === data.login && user.password === data.password) {
                    me.getProfile(user.id, callback);
                    return;
                }
            }
        }
        callback.call(this);
    });
};

UserManager.prototype.save = function(emitter, receiver, callback) {
    if (emitter !== receiver) {
        var query = 'INSERT INTO save SET emitter = ?, receiver = ?';

        DataMgr.client.query(query, [emitter, receiver], function(err, info) {
            callback.call(this, info.insertId);
        });
    } else {
        callback.call(this);
    }
};

UserManager.prototype.write = function(emitter, receiver, data, callback) {
    var query = 'INSERT INTO message SET emitter = ?, receiver = ?, message = ?';

    DataMgr.client.query(query, [emitter, receiver, data.message], function(err, info) {
        callback.call(this, info.insertId);
    });
};

UserManager.prototype.flash = function(emitter, receiver, callback) {
    if (emitter !== receiver) {
        var query = 'INSERT INTO flash SET emitter = ?, receiver = ?';

        DataMgr.client.query(query, [emitter, receiver], function(err, info) {
            callback.call(this, info.insertId);
        });
    } else {
        callback.call(this);
    }
};

UserManager.prototype.visit = function(emitter, receiver, callback) {
    if (emitter !== receiver) {
        var query = 'INSERT INTO visit SET emitter = ?, receiver = ?';

        DataMgr.client.query(query, [emitter, receiver], function(err, info) {
            callback.call(this, info.insertId);
        });
    } else {
        callback.call(this);
    }
};

UserManager.prototype.checkLoginAvailability = function(data, callback) {
    var query = 'SELECT count(*) as total FROM user WHERE login LIKE ?';

    DataMgr.client.query(query, [data.login], function(err, results, fields) {
        callback.call(this, !results[0].total);
    });
};

UserManager.prototype.checkEmailAvailability = function(data, callback) {
    var query = 'SELECT count(*) as total FROM user WHERE email LIKE ?';

    DataMgr.client.query(query, [data.email], function(err, results, fields) {
        callback.call(this, !results[0].total);
    });
};

UserManager.prototype.list = function(queries, values, params, callback) {
    var limit = parseInt(params.pageLimit) || 10,
        start = (params.pageIndex - 1) * limit,
        limitedValues = values.concat([start, limit]),
        count = queries.count,
        query = queries.select + ' LIMIT ?, ?';

    DataMgr.client.query(query, limitedValues, function(err, results, fields) {
        DataMgr.client.query(count, values, function(err, count) {
            callback.call(this, results, count[0].total);
        });
    });
};

UserManager.prototype.list2 = function(queries, values, params, callback) {
    var limit = parseInt(params.pageLimit) || 10,
        start = (params.pageIndex - 1) * limit,
        limitedValues = values.concat([start, limit]),
        count = queries.count,
        query = 'SELECT '+ (queries.fields.join(', ')) +' FROM user '+ queries.where + ' LIMIT ?, ?';

    DataMgr.client.query(query, limitedValues, function(err, results, fields) {
        DataMgr.client.query(count, values, function(err, count) {
            callback.call(this, results, count[0].total);
        });
    });
};

UserManager.prototype.find = function(id, params, callback) {
    var queries = {
        count: 'SELECT COUNT(*) AS total FROM user WHERE gender = ?',
        fields: this.defaultUserFields,
        where: 'WHERE gender = ?'
    };

    this.list2(queries, [params.gender], params, callback);
};

UserManager.prototype.getFlashed = function(id, params, callback) {
    // var queries = {
    //     count: 'SELECT count(*) AS total FROM flash WHERE emitter = ?',
    //     select: 'SELECT id, login, email, pic, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
    //         + 'FROM user WHERE id IN (SELECT receiver FROM flash WHERE emitter = ?)'
    // };
    // 
    // this.list(queries, [id], params, callback);
    var queries = {
        count: 'SELECT count(*) AS total FROM flash WHERE emitter = ?',
        fields: this.defaultUserFields,
        where: 'WHERE id IN (SELECT receiver FROM flash WHERE emitter = ?)'
    };

    this.list2(queries, [id], params, callback);
};

UserManager.prototype.getFlashedBy = function(id, params, callback) {
    // var queries = {
    //     count: 'SELECT count(*) AS total FROM flash WHERE receiver = ?',
    //     select: 'SELECT id, login, email, pic, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = ? AND receiver = user.id) AS saved, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = ? AND receiver = user.id) AS visited, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = ? AND receiver = user.id) AS flashed '
    //         + 'FROM user WHERE id IN (SELECT emitter FROM flash WHERE receiver = ?)'
    // };
    // 
    // this.list(queries, [id], params, callback);

    var queries = {
        count: 'SELECT count(*) AS total FROM flash WHERE receiver = ?',
        fields: this.defaultUserFields,
        where: 'WHERE id IN (SELECT emitter FROM flash WHERE receiver = ?)'
    };

    this.list2(queries, [id], params, callback);
};

UserManager.prototype.getVisited = function(id, params, callback) {
    // var queries = {
    //     count: 'SELECT count(*) AS total FROM visit WHERE emitter = ?',
    //     select: 'SELECT id, login, email, pic, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
    //         + 'FROM user WHERE id IN (SELECT receiver FROM visit WHERE emitter = ?)'
    // };
    // 
    // this.list(queries, [id], params, callback);
    var queries = {
        count: 'SELECT count(*) AS total FROM visit WHERE emitter = ?',
        fields: this.defaultUserFields,
        where: 'WHERE id IN (SELECT receiver FROM visit WHERE emitter = ?)'
    };

    this.list2(queries, [id], params, callback);
};

UserManager.prototype.getVisitedBy = function(id, params, callback) {
    // var queries = {
    //     count: 'SELECT count(*) AS total FROM visit WHERE receiver = ?',
    //     select: 'SELECT id, login, email, pic, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
    //         + 'FROM user WHERE id IN (SELECT emitter FROM visit WHERE receiver = ?)'
    // };
    // 
    // this.list(queries, [id], params, callback);
    var queries = {
        count: 'SELECT count(*) AS total FROM visit WHERE receiver = ?',
        fields: this.defaultUserFields,
        where: 'WHERE id IN (SELECT emitter FROM visit WHERE receiver = ?)'
    };

    this.list2(queries, [id], params, callback);
};

UserManager.prototype.getSaved = function(id, params, callback) {
    // var queries = {
    //     count: 'SELECT count(*) AS total FROM save WHERE emitter = ?',
    //     select: 'SELECT id, login, email, pic, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
    //         + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
    //         + 'FROM user WHERE id IN (SELECT receiver FROM save WHERE emitter = ?)'
    // };
    // 
    // this.list(queries, [id], params, callback);
    var queries = {
        count: 'SELECT count(*) AS total FROM save WHERE emitter = ?',
        fields: this.defaultUserFields,
        where: 'WHERE id IN (SELECT receiver FROM save WHERE emitter = ?)'
    };

    this.list2(queries, [id], params, callback);
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
            + 'DATE_FORMAT(message.cd, "%d/%m/%Y %H:%i") AS cd, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM save WHERE emitter = '+id+' AND receiver = user.id) AS saved, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM visit WHERE emitter = '+id+' AND receiver = user.id) AS visited, '
            + '(SELECT IF (COUNT(*) > 0, true, false) FROM flash WHERE emitter = '+id+' AND receiver = user.id) AS flashed '
            + 'FROM user, message WHERE user.id = IF(message.emitter = ?, message.receiver, message.emitter) ORDER BY message.cd'
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
