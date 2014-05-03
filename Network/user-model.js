var FRAUD_LIMIT = 3;

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
    perms: {type: Array},
    userType: { type: String }
});

var Account = mongoose.model('Account', AccountSchema);

exports.authenticate = function (id, password, succCallback, errCallback) {
    var crypto = require('crypto');
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    var hashedPassword = shaSum.digest('hex');
    Account.findOne({userId: id, password: hashedPassword},
        function(err,doc) {
            if(err) {
                throw new Error('Error occured: ' + err);
            }

            if (doc) {
                // req.session.loggedIn = true;
                // req.session.userId = doc.userId;
                // req.session.perms = doc.perms;
                // exports.loggedInUsers.push({
                //     id: doc.userId,
                //     time: new Date().toUTCString()
                // });
                // exports.logs.push({
                //     message: 'UID ' + req.session.userId + ' has logged in',
                //     type: 'normal',
                //     time: new Date().toUTCString(),
                //     ip: req.connection.remoteAddress
                // });
                succCallback();
            } else {
                errCallback();
            }
        });
};

exports.register = function (userData, callbackSuccess)  {
    var crypto = require('crypto');
    var shaSum = crypto.createHash('sha256');
    shaSum.update(userData.password);
    var hashedPassword = shaSum.digest('hex');

    var user = new Account({
        userId: userData.id,
        password: hashedPassword,
        name: {
            first: userData.first,
            last: userData.last
        },
        age: userData.age,
        gender: userData.gender,
        address: userData.address,
        phone: userData.phone,
        department: userData.department,
        perms: userData.perms // [upload, download, analyse]
    });

    user.save(function (d) {
        callbackSuccess();
    });
};

exports.edit = function () {};
function delUser(id) {
    Account.remove({userId: id}, function (err) {
        if (err) {
            console.log('Error occured:' + err);
            // TODO - mongoose doesnt issue error on invalid delete
        }
    });
}

exports.deleteUser = delUser;

exports.search = function (id, succCallback, errCallback) {
    Account.findOne({userId: id},
        function(err, doc) {
            if(err) {
                throw new Error('Error occured: ' + err);
            }
            if (doc) {
                succCallback(doc);
            } else {
                errCallback();
            }
        });
}

exports.logout = function (req, res) {
    req.session.loggedIn = false;
    exports.logs.push({
        message: 'UID ' + req.session.userId + ' has logged out',
        type: 'normal',
        time: new Date().toUTCString(),
        ip: req.connection.remoteAddress
    });
    res.redirect('/');
};

exports.userRequest = function (req, res) {

    var userOp = req.body.reqType.substring(4);
    if (req.session.perms.indexOf(userOp) === -1) {
        console.log('Fradulent operation');
        // Checking if no if illegal ops has been exceeeded
        ++exports.fraudCount;
        if (exports.fraudCount > FRAUD_LIMIT) {
            console.log('Fradulent access limit exceeded');

            // Logging
            exports.logs.push({
                message: 'UID ' + req.session.userId + ' has been blocked',
                type: 'blocked',
                time: new Date().toUTCString(),
                ip: req.connection.remoteAddress
            });

            Account.remove({userId: req.session.userId}, function (err) {
                if (err) {
                    console.log('Error occured:' + err);
                    res.send(400);
                    // TODO - mongoose doesnt issue error on invalid delete
                }
                console.log('User successfully deleted');
                req.session.loggedIn = false;
                res.send(400, 'blocked');
            });
            
        } else {
            // Logging
            exports.logs.push({
                message: 'UID ' + req.session.userId + ' has made a fraudulent ' +
                    'access (' + userOp + ')',
                type: 'fraud',
                time: new Date().toUTCString(),
                ip: req.connection.remoteAddress
            });

            res.send(400);
        }
    } else {
        console.log('Legal operation');
        // Logging
        exports.logs.push({
            message: 'UID ' + req.session.userId + ' ran ' + userOp +
                ' operation',
            type: 'normal',
            time: new Date().toUTCString(),
            ip: req.connection.remoteAddress
        });
        res.send(200);
    }
};

exports.noOfUsers = 0;
exports.loggedInUsers = [];
exports.fraudCount = 0;
exports.logs = [];
