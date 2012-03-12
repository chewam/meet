var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var id = req.params.id;
    UserMgr.getProfile(id, function(user) {
        user = user || {};
        res.render('edit-profile', {
            item: user,
            path: req.path,
            authorized: true,
            route: '/edit-profile',
            title: 'Meet :: Edit Profile',
            user: req.session.user
        });
    });
};
