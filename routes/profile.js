var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var id = req.params.id;
    UserMgr.visit(req.session.user.id, id, function(user) {
        // req.session.user.visited.push({
        //     user: id,
        //     date: new Date()
        // });
        UserMgr.getProfile(id, function(user) {
            user = user || {};
            res.render('profile', {
                item: user,
                path: req.path,
                authorized: true,
                route: '/profile',
                title: 'Meet :: Profile',
                user: req.session.user
            });
        });
    });
};
