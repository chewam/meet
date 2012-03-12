var UserMgr = require('../app/').UserManager;

module.exports = function(req, res) {
    var user = req.session.user || [];

    res.render('mobile', {
        user: user,
        layout: false
    });

};
