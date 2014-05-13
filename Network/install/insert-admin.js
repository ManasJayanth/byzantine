/**
* Create an admin account post install
*/
var mongoose = require('mongoose');
console.log('Creating admin document in the collection');

mongoose.connect('mongodb://localhost/byzantine');
console.log('Opening collection byzantine...');
var AccountSchema = new mongoose.Schema({
    userId:     { type: String, unique: true },
    password:  { type: String },
    age: { type: Number },
    gender: {type: String },
    address: {type: String },
    phone: { type: String },
    department: { type: String },
    name: {
        first:   { type: String },
        last:    { type: String }
    },
    perms: {type: Array},
    userType: { type: String }
});

var Account = mongoose.model('Account', AccountSchema);
var crypto = require('crypto');
var shaSum = crypto.createHash('sha256');
shaSum.update('admin');
var hashedPassword = shaSum.digest('hex');

var user = new Account({
    userId: 'admin',
    password: hashedPassword,
    name: {
        first: 'Rohit',
        last: 'GS'
    },
    age: 22,
    gender: 'male',
    address: 'Bangalore',
    phone: '',
    department: 'ISE',
    perms: ['upload', 'download', 'analyse'], //[upload, download, analyse]
    alloweAccess: true
});

console.log('Saving admin document..');
user.save(function (err, d) {
    if (err) {
        console.log('Error occured: ');
        console.log(err);
    } else {
        console.log('Manager admin created');
        console.log(JSON.stringify(d));
        console.log('Closing connection');
        mongoose.connection.close();
    }
});
