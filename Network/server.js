var tls = require('tls');
var fs = require('fs');
var user = require('./user-model');

function handleData (buf, stream) {
    var req = JSON.parse(buf.toString());
    if(typeof req.type === 'undefined') {
        console.log('Invalid request');
    } else {
        switch (req.type) {
            case 'auth':
            user.authenticate(req.name, req.password, function () {
                console.log('awesome');
                stream.write('success');
            },
                              function () {
                                  stream.write('error');
                              });
            break;
        }
    }
}

var options = {
    key: fs.readFileSync('server-keys/server-key.pem'),
    cert: fs.readFileSync('server-keys/server-cert.pem'),

    // This is necessary only if using the client certificate authentication.
    requestCert: true,

    // This is necessary only if the client uses the self-signed certificate.
    ca: [ fs.readFileSync('client-keys/client-cert.pem') ]
};

var server = tls.createServer(options, function(cleartextStream) {
    console.log('server connected',
                cleartextStream.authorized ? 'authorized' : 'unauthorized');
    cleartextStream.write("welcome!\n");


    var data = '';
    cleartextStream.on('data', function (chunk) {
        data += chunk;
        handleData(data, cleartextStream);
    });
    cleartextStream.on('end', function () {
        handleData(data, cleartextStream);
    });
    cleartextStream.setEncoding('utf8');
    cleartextStream.pipe(cleartextStream);
});

server.listen(8000, function() {
    console.log('server bound');
});
