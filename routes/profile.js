var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var id = req.params.id;
    UserMgr.visit(req.session.user._id, id, function() {
        req.session.user.visited.push({
            user: id,
            date: new Date()
        });
        UserMgr.get(id, function(error, record) {
            res.render('profile', {
                item: record,
                route: '/profile',
                title: 'Meet :: Profile',
                user: req.session.user
            });
        });
    });
};
