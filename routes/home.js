module.exports = function(req, res) {
    res.render('home', {
        title: 'Meet :: Home',
        user: req.session.user
    });
};
