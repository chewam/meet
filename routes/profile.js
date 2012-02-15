var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var id = req.params.id;
    UserMgr.visit(req.session.user.id, id, function(user) {
        // req.session.user.visited.push({
        //     user: id,
        //     date: new Date()
        // });
        UserMgr.get(id, function(user) {
            user = user || {};
            res.render('profile', {
                item: user,
                authorized: true,
                route: '/profile',
                title: 'Meet :: Profile',
                user: req.session.user
            });
        });
    });
};
