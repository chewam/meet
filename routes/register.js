module.exports = function(req, res) {
    var data = req.body;
    if (data.login && data.password && data.email && data.gender) {
        var UserMgr = require('../app/').UserManager;
        data.pic = '/images/pictures/default.png';
        UserMgr.create(data, function(user) {
            if (user) {
                req.session.user = user;
                res.redirect('/home');
            } else {
                res.render('index', {
                    authorized: false,
                    title: 'Meet :: Register',
                    user: req.session.user
                });
            }
        });
    } else {
        res.render('register', {
            authorized: false,
            title: 'Meet :: Register',
            user: req.session.user
        });
    }
};
