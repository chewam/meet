var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var user = req.session.user,
        gender = user.gender == 'Male' ? 'Female' : 'Male';

    UserMgr.find(user.id, {gender: gender, pageIndex: 1, pageLimit: 8}, function(users) {
        users = users || [];
        res.render('home', {
            path: req.path,
            authorized: true,
            title: 'Meet :: Home',
            user: user,
            items: users
        });
    });

};
