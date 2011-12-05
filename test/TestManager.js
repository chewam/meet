var currentUser,
    fs = require('fs'),
    http = require('http'),
    app = require('../app/'),
    bootstrap = require('bootstrap'),
    querystring = require('querystring');

var UserMgr = app.UserManager;

function TestManager() {
    this.tests = [
        'createUser', 'updateUser', 'getUser', 'deleteUser', 'getUsers',
        'createHttpUser', 'updateHttpUser', 'getHttpUser', 'deleteHttpUser', 'getHttpUsers'
    ];
}

TestManager.prototype.run = function(callback, index, html) {
    var self = this,
        l = this.tests.length;

    index = index || 0;

    if (!index) {
        this.runCallback = callback;
    }

    if (index > l - 1) {
        this.runCallback.call(this, html);
        return;
    }

    callback = function(res) {
        html += res;
        self.run.call(self, undefined, ++index, html);
    };

    this[this.tests[index]](callback);
};

TestManager.prototype.createUser = function(callback) {
    UserMgr.create({
        login: 'John',
        password: 'supapass',
        email: 'john@nowhere.com',
        country: 'france',
        gender: 'm',
        pic: 'http://mypic.com/john_smith.png'
    }, function(error, user) {
        var label, html;

        if (!error) {
            currentUser = user;
            html = bootstrap.table([user.toObject()]);
            label = {text: 'success', cls: 'success'};
        } else {
            label = {text: 'failure', cls: 'important'};
        }

        html = '<h1>SERVER TESTS</h1>'
            + bootstrap.pageHeader({title: 'Create user', label: label})
            + html;

        callback.call(this, html);
    });
};

TestManager.prototype.updateUser = function(callback) {
    var data = {login: 'Bob'};
    UserMgr.update(currentUser, data, function(error, user) {
        var html, label;

        if (!error) {
            html = bootstrap.table([user.toObject()]);
            label = {text: 'success', cls: 'success'};
        } else {
            label = {text: 'failure', cls: 'important'};
        }

        html = bootstrap.pageHeader({title: 'Update user', label: label}) + html;
        callback.call(this, html);
    });
};

TestManager.prototype.getUser = function(callback) {
    UserMgr.get(currentUser._id, function(error, user) {
        var html, label;

        if (!error) {
            html = bootstrap.table([user.toObject()]);
            label = {text: 'success', cls: 'success'};
        } else {
            label = {text: 'failure', cls: 'important'};
        }

        html = bootstrap.pageHeader({title: 'Get user', label: label}) + html;
        callback.call(this, html);
    });
};

TestManager.prototype.deleteUser = function(callback) {
    UserMgr.remove(currentUser, function(error) {
        var html, label;

        if (!error) {
            html = bootstrap.table([currentUser.toObject()]);
            label = {text: 'success', cls: 'success'};
        } else {
            label = {text: 'failure', cls: 'important'};
        }

        html = bootstrap.pageHeader({title: 'Delete user', label: label}) + html;
        callback.call(this, html);
    });
};

TestManager.prototype.getUsers = function(callback) {
    var count = 5;

    UserMgr.find(
        null,
        {pageSize: count, page: 1},
        function(error, users) {
            var html, label, data = [];
            for (var key in users) {
                data.push(users[key].toObject());
            }
            if (!error) {
                html = bootstrap.table(data);
                label = {text: 'success', cls: 'success'};
            } else {
                label = {text: 'failure', cls: 'important'};
            }

            var html = bootstrap.pageHeader({title: 'Get '+ count +' users', label: label}) + html;
            callback.call(this, html);
        }
    );
};

TestManager.prototype.createHttpUser = function(callback) {

    var query = querystring.stringify({
        login: 'John',
        password: 'supapass',
        email: 'john@nowhere.com',
        country: 'france',
        gender: 'm',
        pic: 'http://mypic.com/john_smith.png'
    });

    var options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/users',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': query.length
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            currentUser = JSON.parse(data);
            var html = '<h1>HTTP TESTS</h1>';
            html += bootstrap.pageHeader({title: 'Create user', subTitle: 'POST /users ' + query});
            html += bootstrap.well(data);
            callback.call(this, html);
        });
    });

    req.write(query);

    req.end();
};

TestManager.prototype.updateHttpUser = function(callback) {

    var query = querystring.stringify({
        login: 'Bob'
    });

    var options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/users/' + currentUser._id,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': query.length
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            var html = bootstrap.pageHeader({title: 'Update user', subTitle: 'PUT /users/' + currentUser._id + ' ' + query});
            html += bootstrap.well(data);
            callback.call(this, html);
        });
    });

    req.write(query);

    req.end();
};

TestManager.prototype.deleteHttpUser = function(callback) {

    var options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/users/' + currentUser._id,
        method: 'DELETE',
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            var html = bootstrap.pageHeader({title: 'Delete user', subTitle: 'DELETE /users/' + currentUser._id});
            html += bootstrap.well(data);
            callback.call(this, html);
        });
    });

    req.end();
};

TestManager.prototype.getHttpUser = function(callback) {

    var options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/users/' + currentUser._id,
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            var html = bootstrap.pageHeader({title: 'Get user', subTitle: 'POST /users/' + currentUser._id});
            html += bootstrap.well(data);
            callback.call(this, html);
        });
    });

    req.end();

};

TestManager.prototype.getHttpUsers = function(callback) {
    var count = 5;

    var options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/users',
        method: 'GET'
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            var html = bootstrap.pageHeader({title: 'Get '+ count +' users', subTitle: 'POST /users'});
            html += bootstrap.well(data);
            callback.call(this, html);
        });
    });

    req.end();

};

module.exports = new TestManager();
