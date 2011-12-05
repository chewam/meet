
/*
 * GET pages.
 */

var UserMgr = require('../app/').UserManager,
    TestMgr = require('../test').TestManager;

// UTILS

exports.checkSession = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

// INDEX
exports.index = function(req, res) {
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('index', {title: 'Meet', user: req.session.user});
    }
};

// LOGIN
exports.login = function(req, res) {
    var data = req.body;
    if (data.login && data.password) {
        UserMgr.login(data, function(error, user) {
            if (!error && user) {
                req.session.user = user;
                res.redirect('/home');
            } else {
                res.render('login', {title: 'Meet :: Login', user: req.session.user});
            }
        });
    } else {
        res.render('login', {title: 'Meet :: Login', user: req.session.user});
    }
};

// LOGOUT
exports.logout = function(req, res) {
    delete req.session.user;
    res.redirect('/');
};

// REGISTER
exports.register = function(req, res) {
    var data = req.body;
    if (data.login && data.password && data.email && data.gender) {
        UserMgr.create(data, function(error, user) {
            if (!error && user) {
                req.session.user = user;
                res.redirect('/home');
            } else {
                res.render('index', {title: 'Meet', user: req.session.user});
            }
        });
    } else {
        res.render('register', {title: 'Meet', user: req.session.user});
    }
};

// HOME
exports.home = function(req, res) {
    res.render('home', {
        title: 'Meet :: Home',
        user: req.session.user
    });
};

// SEARCH
exports.search = function(req, res) {
    var q = req.query,
        user = req.session.user;

    q.pageIndex = q.pageIndex || 1;
    q.pageSize = q.pageSize || 10;

    UserMgr.find(user, q, function(error, docs, count) {
        var items = [];
        if (!error) {
            items = docs;
        }
        res.render('search', {
            items: items,
            title: 'Meet :: Search',
            user: req.session.user,
            pageIndex: parseInt(q.pageIndex),
            pageCount: Math.ceil(count / q.pageSize)
        });
    });
};

// USERS
exports.getUsers = function(req, res) {
    UserMgr.find(null, {pageSize: 10}, function(error, records) {
        res.end(JSON.stringify(records));
    });
};

exports.getUser = function(req, res) {
    UserMgr.get(req.params.id, function(error, record) {
        res.end(JSON.stringify(record));
    });
};

exports.createUser = function(req, res) {
    var data = req.body;
    UserMgr.create(data, function(error, record) {
        res.end(JSON.stringify(record));
    });
};

exports.updateUser = function(req, res) {
    var data = req.body;
    UserMgr.update(req.params.id, data, function(error, record) {
        res.end(JSON.stringify(record));
    });
}

exports.deleteUser = function(req, res) {
    UserMgr.remove(req.params.id, function(error, record) {
        res.end('{success: true}');
    });
}

// TESTS
exports.tests = function(req, res) {
    TestMgr.run(function(html) {
        res.render('tests', {
            title: 'Meet :: tests',
            body: html,
            user: req.session.user
        });
    });
};
