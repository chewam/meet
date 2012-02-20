module.exports = function(req, res) {
    var data = req.body;
    if (data.login && data.password) {
        var UserMgr = require('../app/').UserManager;
        UserMgr.login(data, function(user) {
            if (user) {
                req.session.user = user;
                res.redirect('/home');
            } else {
                res.render('login', {
                    path: req.path,
                    authorized: false,
                    title: 'Meet :: Login',
                    user: req.session.user
                });
            }
        });
    } else {
        res.render('login', {
            path: req.path,
            authorized: false,
            title: 'Meet :: Login',
            user: req.session.user
        });
    }
};
