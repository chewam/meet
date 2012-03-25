
/*
 * GET pages.
 */

var fs = require('fs'),
    UserMgr = require('../app/').UserManager,
    EventMgr = require('../app/').EventManager;
    // TestMgr = require('../test').TestManager;

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
        res.render('index', {
            path: req.path,
            authorized: false,
            title: 'Meet :: Index',
            user: req.session.user
        });
    }
};


// WEB SITE

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

// EDIT PROFILE
exports.editProfile = require('./editProfile');

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

// MOBILE
exports.mobile = require('./mobile');



// WEB SERVICE

exports.signIn = function(req, res) {
    if (req.session.user) {
        res.end(JSON.stringify({
            success: true,
            data: req.session.user
        }));
    } else if (req.query.login && req.query.password) {
        var data = {
            login: req.query.login,
            password: req.query.password
        };

        UserMgr.login(data, function(users) {
            if (users) {
                req.session.user = users;
            }
            res.end(JSON.stringify({
                success: !!users,
                data: users
            }));
        });
    } else {
        res.end(JSON.stringify({success: false}));
    }
};

exports.getUsers = function(req, res) {
    var q = req.query,
        user = req.session.user;

    q.gender = user.gender == 'Male' ? 'Female' : 'Male';

    UserMgr.find(user.id, q, function(users, count) {
          res.end(JSON.stringify({
              data: users,
              count: count
          }));
    });
};

exports.updateUser = function(req, res) {
    var data = req.body;

    UserMgr.update(req.params.id, data, function(error, record) {
        res.end(JSON.stringify({success: true}));
    });
};

exports.getSaved = function(req, res) {
    var q = req.query,
        user = req.session.user;

    UserMgr.getSaved(user.id, q, function(users, count) {
        res.end(JSON.stringify({
            data: users,
            count: count
        }));
    });
};

exports.getFlashed = function(req, res) {
    var q = req.query,
        user = req.session.user;

    UserMgr.getFlashed(user.id, q, function(users, count) {
        res.end(JSON.stringify({
            data: users,
            count: count
        }));
    });
};

exports.getVisited = function(req, res) {
    var q = req.query,
        user = req.session.user;

    UserMgr.getVisited(user.id, q, function(users, count) {
        res.end(JSON.stringify({
            data: users,
            count: count
        }));
    });
};

exports.getFlashedBy = function(req, res) {
    var q = req.query,
        user = req.session.user;

    UserMgr.getFlashedBy(user.id, q, function(users, count) {
        res.end(JSON.stringify({
            data: users,
            count: count
        }));
    });
};

exports.getVisitedBy = function(req, res) {
    var q = req.query,
        user = req.session.user;

    UserMgr.getVisitedBy(user.id, q, function(users, count) {
        res.end(JSON.stringify({
            data: users,
            count: count
        }));
    });
};

exports.getPic = function(req, res) {
    var id = req.session.user.id,
        name = req.params.name,
        path = __dirname + '/../files/images/'+id+'/'+name;

    function safeRead(filename, callback) {
        fs.readFile(filename, function (err, data) {
            if (err) {
                if (err.errno === process.ENOENT) {
                    callback(null, "");
                } else {
                    callback(err);
                }
            } else {
                callback(null, data);
            }
        });
    }

    safeRead(path, function (err, data) {
        if (err) {
            throw err;
        } else {
            res.writeHead(200, {'Content-Type': 'image/jpg' });
            res.end(data, 'binary');
        }
    });

};

exports.flashUser = function(req, res) {
    var user = req.session.user;

    UserMgr.flash(user.id, req.params.id, function() {
        // req.session.user.flashed.push({
        //     user: req.params.id,
        //     date: new Date()
        // });
        EventMgr.emit(req.params.id, 'flash', {
            id: user.id,
            age: user.age,
            status: user.status,
            pic: user.pic,
            login: user.login,
            gender: user.gender,
            city: user.city,
            country: user.country
        });
        res.end(JSON.stringify({success: true}));
    });
};

exports.visitUser = function(req, res) {
    var user = req.session.user;

    UserMgr.visit(user.id, req.params.id, function() {
        // req.session.user.flashed.push({
        //     user: req.params.id,
        //     date: new Date()
        // });
        EventMgr.emit(req.params.id, 'visit', {
            id: user.id,
            age: user.age,
            status: user.status,
            pic: user.pic,
            login: user.login,
            gender: user.gender,
            city: user.city,
            country: user.country
        });
        res.end(JSON.stringify({success: true}));
    });
};

exports.saveUser = function(req, res) {
    var user = req.session.user;

    UserMgr.save(user.id, req.params.id, function() {
        // req.session.user.saved.push({
        //     user: req.params.id,
        //     date: new Date()
        // });
        res.end(JSON.stringify({success: true}));
    });
}

// exports.isLogged = function(req, res) {
    // res.end(JSON.stringify({
    //     success: !!req.session.user,
    //     data: req.session.user ? [req.session.user] : undefined
    // }));
// };
// 
// exports.logUser = function(req, res) {
    // var data = req.body;
    // 
    // UserMgr.login(data, function(user) {
    //     if (user && user.login) {
    //         req.session.user = user;
    //     }
    //     res.end(JSON.stringify({
    //         success: !!user,
    //         data: user ? [user] : undefined
    //     }));
    // });
// };
// 
// exports.getUsers = function(req, res) {
//     var q = req.query,
//         user = req.session.user;
// 
//     // q.pageIndex = q.pageIndex || 1;
//     // q.pageLimit = q.pageLimit || 10;
// 
//     UserMgr.find(user.id, q, function(users, count) {
//           res.end(JSON.stringify({
//               data: users,
//               count: count
//           }));
//     });
// };
// 
// exports.getUser = function(req, res) {
//     UserMgr.get(req.params.id, function(error, record) {
//         res.end(JSON.stringify(record));
//     });
// };
// 
// exports.createUser = function(req, res) {
//     var data = req.body;
//     UserMgr.create(data, function(error, record) {
//         res.end(JSON.stringify(record));
//     });
// };
// 
// 
// exports.deleteUser = function(req, res) {
//     UserMgr.remove(req.params.id, function(error, record) {
//         res.end('{success: true}');
//     });
// }
// 
// 
// 
// exports.writeUser = function(req, res) {
//     var data = req.body;
//     UserMgr.write(req.session.user._id, req.params.id, data, function() {
//         // req.session.user.flashed.push({
//         //     user: req.params.id,
//         //     date: new Date()
//         // });
//         res.end('{success: true}');
//     });
// }
// 
// // TESTS
// exports.tests = function(req, res) {
//     TestMgr.run(function(html) {
//         res.render('tests', {
//             title: 'Meet :: tests',
//             body: html,
//             user: req.session.user
//         });
//     });
// };
