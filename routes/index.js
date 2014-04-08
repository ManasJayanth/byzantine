exports.index = function(req, res){
    res.render('index', {error: false});
};

exports.renderSignUpPage = function (req, res) {
    res.render('sign-up-page');
};

exports.dashboard = function(req, res){
    if (req.session.loggedIn) {
        res.render('dashboard');
    } else {
        res.redirect('/');
    }
};

exports.managerLogin = function (req, res) {
    res.render('manager-login');
};

exports.managerDashboard = function(req, res){
    if (req.session.loggedIn) {
        res.render('manager-dashboard');
    } else {
        res.redirect('/');
    }
};

exports.userRequest = function (req, res) {
    var userOp = req.body.reqType.substring(4);
    if (req.session.perms.indexOf(userOp) === -1) {
        console.log('Fradulent operation');
        res.send(400);
    } else {
        console.log('Legal operation');
        res.send(200);
    }
};
