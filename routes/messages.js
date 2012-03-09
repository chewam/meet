var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var q = req.query,
        user = req.session.user;

    q.pageIndex = q.pageIndex || 1;
    q.pageSize = q.pageSize || 10;

    UserMgr.getMessages(user.id, q, function(messages, count) {
        messages = messages || [];
        console.log('---> messages: ', messages);
        res.render('activity', {
            items: messages,
            path: req.path,
            authorized: true,
            route: '/activity/messages',
            title: 'Meet :: Activity',
            user: req.session.user,
            pageIndex: parseInt(q.pageIndex),
            pageCount: Math.ceil(count / q.pageSize)
        });
    });
};
