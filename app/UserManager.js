var DataMgr = require('./DataManager');

function UserManager() {}

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

module.exports = new UserManager();
