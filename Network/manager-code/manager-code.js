var tls = require('tls'),
    fs = require('fs'),
    dir = '/Users/prometheansacrifice/development/js/byzantine/Network';

function handleData (buf) {

    var res = JSON.parse(buf.toString());
    if(typeof res.type === 'undefined') {
        console.log('Invalid request');
    } else {
        switch (res.type) {
        case 'loginSucess':
            displayDashboard();
            break;
            
        default:
            console.log('Unknown request type');
            break;
        }
    }
}

function displayDashboard () {
    
}


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
        $('body').html("Connection not authorized: " +
                                conn.authorizationError);
    }
});

conn.on("data", function (data) {
    handleData(data);
});


function userLogin () {
    console.log('Connection authorized by a Certificate Authority.');
    var loginTemplate = $('#login-template').html();
    $('body').html(loginTemplate);

    //--- UI Event ---//
    $('#manager-login-submit').on('click', function () {
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
