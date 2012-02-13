module.exports = function(req, res) {
    var data = req.body;
    if (data.login && data.password) {
        var UserMgr = require('../app/').UserManager;
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
