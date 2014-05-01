var tls = require('tls'),
    fs = require('fs'),
dir = '/Users/prometheansacrifice/development/js/byzantine/Network';

var options = {
    key: fs.readFileSync(dir + '/client-keys/client-key.pem'),
    cert: fs.readFileSync(dir + '/client-keys/client-cert.pem'),
    rejectUnauthorized: true,
    ca: [ fs.readFileSync(dir + '/server-keys/server-cert.pem') ]
};

var conn = tls.connect(8000, '127.0.0.1', options, function() {
    if (conn.authorized) {
        userLogin();
    } else {
        $('#id').html("Connection not authorized: " + conn.authorizationError);
    }
});

conn.on("data", function (data) {
//    console.log(data.toString());
});


function userLogin () {
    console.log('Connection authorized by a Certificate Authority.');
    var loginTemplate = $('#login-template').html();
    $('#id').html(loginTemplate);

    //--- UI Event ---//
    $('#client-login-submit').on('click', function () {
        // conn.write(JSON.stringify({
        //     name: 'admin',
        //     password: 'admin',
        //     type: 'auth'
        // }));

        conn.write(JSON.stringify({
            name: $('#userId').val(),
            password: $('#password').val(),
            type: 'auth'
        }));
    });
}
