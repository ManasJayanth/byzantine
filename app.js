/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./models/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use( express.cookieParser() );
app.use(express.session({secret: '1234567890QWERTY'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/sign-up-page', routes.renderSignUpPage);
app.post('/authentication', user.authenticate);
app.post('/manager-authentication', user.authenticateManager);
app.post('/register', user.register);
app.get('/dashboard', routes.dashboard);
app.post('/user-request', routes.userRequest);
app.post('/delete-user', user.deleteUser);
app.get('/manager-dashboard', routes.managerDashboard);
app.get('/manager-login', routes.managerLogin);
app.post('/file-upload', routes.fileUpload);
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
