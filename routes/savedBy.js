var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var q = req.query,
        user = req.session.user;

    q.pageIndex = q.pageIndex || 1;
    q.pageSize = q.pageSize || 10;

    UserMgr.getSavedBy(user.id, q, function(users, count) {
        users = users || [];
        res.render('activity', {
            items: users,
            authorized: true,
            route: '/activity/savedby',
            title: 'Meet :: Activity',
            user: req.session.user,
            pageIndex: parseInt(q.pageIndex),
            pageCount: Math.ceil(count / q.pageSize)
        });
    });
};
