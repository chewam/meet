var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var q = req.query,
        user = req.session.user;

    q.pageIndex = q.pageIndex || 1;
    q.pageSize = q.pageSize || 10;

    UserMgr.getSaved(user._id, q, function(error, docs, count) {
        var items = [];
        if (!error) {
            items = docs;
        }
        res.render('activity', {
            items: items,
            route: '/activity/saved',
            title: 'Meet :: Activity',
            user: req.session.user,
            pageIndex: parseInt(q.pageIndex),
            pageCount: Math.ceil(count / q.pageSize)
        });
    });
};
