
/**
 * Module dependencies.
 */

console.log("---> Node version:", process.version);

var express = require('express'),
    routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'meet'}));
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

app.get('/users', routes.getUsers);
app.post('/users', routes.createUser);
app.get('/users/:id', routes.getUser);
app.put('/users/:id', routes.updateUser);
app.del('/users/:id', routes.deleteUser);

app.post('/users/:id/flash', routes.flashUser);

app.listen(3000);

console.log("---> Express server listening on port %d in %s mode", app.address().port, app.settings.env);
