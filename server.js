/**
 * Module dependencies.
 */

console.log("---> Node version:", process.version);

var express = require('express'),
    routes = require('./routes'),
    EventMgr = require('./app/EventManager');

var sessionStore = new express.session.MemoryStore();

var app = module.exports = express.createServer();

EventMgr.init(app, sessionStore);

// Configuration

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'meet', store: sessionStore, key: 'meet.sid'}));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
    app.use(express.errorHandler());
});


// WEB SITE

app.all('/', routes.index);
app.all('/login', routes.login);
app.all('/logout', routes.logout);
app.all('/register', routes.register);

app.get('/mobile', routes.mobile);

app.get('/home', routes.checkSession, routes.home);
app.get('/search', routes.checkSession, routes.search);
app.get('/tests', routes.checkSession, routes.tests);

app.get('/profile/:id/edit', routes.checkSession, routes.editProfile);
app.get('/profile/:id', routes.checkSession, routes.profile);

app.get('/activity', routes.checkSession, routes.activity);
app.get('/activity/messages', routes.checkSession, routes.messages);
app.get('/activity/flashedby', routes.checkSession, routes.flashedBy);
app.get('/activity/flashed', routes.checkSession, routes.flashed);
app.get('/activity/savedby', routes.checkSession, routes.savedBy);
app.get('/activity/saved', routes.checkSession, routes.saved);
app.get('/activity/visited', routes.checkSession, routes.visited);
app.get('/activity/visitedby', routes.checkSession, routes.visitedBy);


// WEB SERVICE

app.get('/ws/signIn', routes.signIn);
// app.post('/ws/signOn', routes.signOn);
// app.post('/ws/checkLoginAvailability', routes.checkLoginAvailability);
// app.post('/ws/checkEmailAvailability', routes.checkEmailAvailability);
// 

app.get('/ws/user/pic/:name'/*, routes.checkSession*/, routes.getPic);
app.get('/ws/user/getVisited', routes.checkSession, routes.getVisited);
app.get('/ws/user/getFlashed', routes.checkSession, routes.getFlashed);
app.get('/ws/user/getVisitedBy', routes.checkSession, routes.getVisitedBy);
app.get('/ws/user/getFlashedBy', routes.checkSession, routes.getFlashedBy);

app.put('/ws/users/:id', routes.checkSession, routes.updateUser);

// app.get('/ws/users/:id/getFlash', routes.checkSession, routes.getFlash);

app.get('/ws/users', routes.checkSession, routes.getUsers);
// app.post('/ws/users', routes.checkSession, routes.createUser);
// 
// // app.get('/ws/users/isLogged', routes.isLogged);
// // app.post('/ws/users/login', routes.logUser);
// 
// app.get('/ws/users/:id', routes.checkSession, routes.getUser);

// app.del('/ws/users/:id', routes.checkSession, routes.deleteUser);
// 
// app.post('/ws/users/:id/write', routes.checkSession, routes.writeUser);
// app.post('/ws/users/:id/flash', routes.checkSession, routes.flashUser);
// app.post('/ws/users/:id/save', routes.checkSession, routes.saveUser);
// 
// // app.post('/utils/:method', routes.utils);

app.listen(3000);

console.log("---> Express server listening on port %d in %s mode", app.address().port, app.settings.env);
