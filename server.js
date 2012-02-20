
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

// Routes

app.all('/', routes.index);
app.all('/login', routes.login);
app.all('/logout', routes.logout);
app.all('/register', routes.register);

app.get('/home', routes.checkSession, routes.home);
app.get('/search', routes.checkSession, routes.search);
app.get('/tests', routes.checkSession, routes.tests);

app.get('/profile/:id', routes.checkSession, routes.profile);

app.get('/activity', routes.checkSession, routes.activity);
app.get('/activity/messages', routes.checkSession, routes.messages);
app.get('/activity/flashedby', routes.checkSession, routes.flashedBy);
app.get('/activity/flashed', routes.checkSession, routes.flashed);
app.get('/activity/savedby', routes.checkSession, routes.savedBy);
app.get('/activity/saved', routes.checkSession, routes.saved);
app.get('/activity/visited', routes.checkSession, routes.visited);
app.get('/activity/visitedby', routes.checkSession, routes.visitedBy);

app.get('/users', routes.getUsers);
app.post('/users', routes.createUser);
app.get('/users/:id', routes.getUser);
app.put('/users/:id', routes.updateUser);
app.del('/users/:id', routes.deleteUser);

app.post('/users/:id/write', routes.writeUser);
app.post('/users/:id/flash', routes.flashUser);
app.post('/users/:id/save', routes.saveUser);

app.post('/utils/:method', routes.utils);

app.listen(3000);

console.log("---> Express server listening on port %d in %s mode", app.address().port, app.settings.env);
