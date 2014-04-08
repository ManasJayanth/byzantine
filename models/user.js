var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/byzantine');

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
    userType: { type: String }
});

var Account = mongoose.model('Account', AccountSchema);

exports.authenticate = function (req, res) {
    console.log(req.body.userId);
    Account.findOne({userId: req.body.userId, password: req.body.password},
        function(err,doc) {
            if(err) {
                throw new Error('Error occured: ' + err);
            }
            if (doc) {
                req.session.loggedIn = true;
                //console.log('Successfully logged in');
                res.redirect('/dashboard');
            } else {
                res.render('index', {error: true});
            }
        });
};

exports.authenticateManager = function (req, res) {
    console.log(req.body.userId);
    Account.findOne({userId: req.body.userId, password: req.body.password,
        userType: 'manager'}, function(err,doc) {
            if(err) {
                throw new Error('Error occured: ' + err);
            }
            if (doc) {
                req.session.loggedIn = true;
                res.redirect('/manager-dashboard');
            } else {
                res.render('index', {error: true});
            }
        });
};

exports.register = function (req, res)  {

    var user = new Account({
        userId: req.body.userId,
        password: req.body.password,
        name: {
            first: req.body.first,
            last: req.body.last
        },
        age: req.body.age,
        gender: req.body.gender,
        address: req.body.address,
        phone: req.body.phone,
        department: req.body.department,
        perms: req.body.perms, // [upload, download, analyse]
        userType: 'client'
    });
    user.save(function () {
        console.log('saved');
    });
    res.send(200);
};
