module.exports = function(req, res) {
    res.render('home', {
        authorized: true,
        title: 'Meet :: Home',
        user: req.session.user
    });
};
