
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
    // console.log('REQ', req, req.path);
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.render('index', {
            path: req.path,
            authorized: false,
            title: 'Meet :: Index',
            user: req.session.user
        });
    }
};

// UTILS
exports.utils = require('./utils');

// LOGIN
exports.login = require('./login');

// LOGOUT
exports.logout = require('./logout');

// REGISTER
exports.register = require('./register');

// HOME
exports.home = require('./home');

// SEARCH
exports.search = require('./search');

// PROFILE
exports.profile = require('./profile');

// ACTIVITY
exports.activity = require('./activity');

// ACTIVITY :: MESSAGES
exports.messages = require('./messages');

// ACTIVITY :: FLASHED BY
exports.flashedBy = require('./flashedBy');

// ACTIVITY :: FLASHED
exports.flashed = require('./flashed');

// ACTIVITY :: SAVED BY
exports.savedBy = require('./savedBy');

// ACTIVITY :: SAVED
exports.saved = require('./saved');

// ACTIVITY :: VISITED
exports.visited = require('./visited');

// ACTIVITY :: VISITED BY
exports.visitedBy = require('./visitedBy');

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

exports.flashUser = function(req, res) {
    UserMgr.flash(req.session.user.id, req.params.id, function() {
        // req.session.user.flashed.push({
        //     user: req.params.id,
        //     date: new Date()
        // });
        res.end('{success: true}');
    });
}

exports.saveUser = function(req, res) {
    UserMgr.save(req.session.user.id, req.params.id, function() {
        // req.session.user.saved.push({
        //     user: req.params.id,
        //     date: new Date()
        // });
        res.end('{success: true}');
    });
}

exports.writeUser = function(req, res) {
    var data = req.body;
    UserMgr.write(req.session.user._id, req.params.id, data, function() {
        // req.session.user.flashed.push({
        //     user: req.params.id,
        //     date: new Date()
        // });
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
