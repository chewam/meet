module.exports = function(req, res) {
    var data = req.body;
    if (data.login && data.password && data.email && data.gender) {
        var UserMgr = require('../app/').UserManager;
        data.pic = 'default.png';
        UserMgr.create(data, function(error, user) {
            if (!error && user) {
                req.session.user = user;
                res.redirect('/home');
            } else {
                res.render('index', {title: 'Meet :: Register', user: req.session.user});
            }
        });
    } else {
        res.render('register', {title: 'Meet :: Register', user: req.session.user});
    }
};
