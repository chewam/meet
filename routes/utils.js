module.exports = function(req, res) {
    var data = req.body,
        method = req.params.method,
        UserMgr = require('../app/').UserManager;

    if (method = UserMgr[method]) {
        method.call(UserMgr, data, function(success) {
            if (success && success.login) {
                req.session.user = success;
            }
            res.end(JSON.stringify({success: success}));
        });
    }

};
