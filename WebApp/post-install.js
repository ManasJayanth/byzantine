/**
* Create an admin account post install
*/
var user = require('./models/user');
user.createAdmin();
