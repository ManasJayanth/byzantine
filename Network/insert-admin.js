/**
* Create an admin account post install
*/
var user = require('./user-model');
user.createAdmin();
