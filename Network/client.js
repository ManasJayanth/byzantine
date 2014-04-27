var tls = require('tls'),
    fs = require('fs');

var options = {
    key: fs.readFileSync('client-keys/client-key.pem'),
    cert: fs.readFileSync('client-keys/client-cert.pem'),
    rejectUnauthorized: true,
    ca: [ fs.readFileSync('server-keys/server-cert.pem') ]
};

var conn = tls.connect(8000, '127.0.0.1', options, function() {
    if (conn.authorized) {
        console.log("Connection authorized by a Certificate Authority.");
        conn.write(JSON.stringify({name: 'admin', password: 'admin', type: 'auth'}));
    } else {
        console.log("Connection not authorized: " + conn.authorizationError)
    }
});

conn.on("data", function (data) {
    console.log(data.toString());
});
