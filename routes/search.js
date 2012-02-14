var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {

    var q = {};
    q.pageIndex = 1;
    q.pageSize = 10;

    UserMgr.list(function(users, count) {
        res.render('search', {
            items: users,
            route: '/search',
            authorized: true,
            title: 'Meet :: Search',
            user: req.session.user,
            pageIndex: parseInt(q.pageIndex),
            pageCount: Math.ceil(count / q.pageSize)
        });
    });
    
    // var q = req.query,
    //     user = req.session.user;
    // 
    // q.pageIndex = q.pageIndex || 1;
    // q.pageSize = q.pageSize || 10;
    // 
    // UserMgr.find(user, q, function(error, docs, count) {
    //     var items = [];
    //     if (!error) {
    //         items = docs;
    //     }
    //     res.render('search', {
    //         items: items,
    //         route: '/search',
    //         authorized: true,
    //         title: 'Meet :: Search',
    //         user: req.session.user,
    //         pageIndex: parseInt(q.pageIndex),
    //         pageCount: Math.ceil(count / q.pageSize)
    //     });
    // });
};
