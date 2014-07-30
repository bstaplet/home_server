var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http')

var routes = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('/routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/***** GET REQUESTS *****/
app.get('/register', register.register);
app.get('/register/add', register.add);
app.get('/login', login.login);
app.get('/login/main', login.main);

/***** POST REQUESTS *****/
app.post('/register/submit', register.submit);
app.post('/login/auth', login.auth);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = http.createServer(app);

// WebSockets/Socket.IO
var io = require('socket.io', {'log level': 0}).listen(server);

io.sockets.on('connection', function (socket) {
  login.initSocket(socket);
});

server.listen(8080, function(){
  console.log("Express server listening on port %d in %s mode",
              server.address().port, app.settings.env);
});

module.exports = app;
