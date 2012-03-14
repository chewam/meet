var UserMgr = require('../app/').UserManager,
    EventMgr = require('../app/').EventManager;

module.exports = function(req, res) {
    var id = req.params.id,
        user = req.session.user;

    UserMgr.visit(user.id, id, function(success) {
        if (success) {
            EventMgr.emit(id, 'visit', {
                id: user.id,
                age: user.age,
                status: user.status,
                pic: user.pic,
                login: user.login,
                gender: user.gender,
                city: user.city,
                country: user.country
            });
        }
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
