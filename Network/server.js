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
            user.authenticate(req.name, req.password,
            function () {
                console.log('Successful login')
                stream.write(JSON.stringify({
                    type: 'loginSuccess'
                }));
            },
            function () {
                console.log('Login failed');
            });
            break;

        case 'newUserDetails':
            user.register(req.data, function () {
                stream.write(JSON.stringify({
                    type: 'registrationSuccess'
                }));
            });
            break;
            
        case 'searchUser':
            user.search(req.data,
                function (doc) {
                    stream.write(JSON.stringify({
                        type: 'searchUserResults',
                        data: doc
                    }));
                },
                function () {
                    stream.write(JSON.stringify({
                        type: 'searchUserResults',
                        data: 'none'
                    }));
                });
            break;

        case 'editUserDetails':
            user.edit(req.data,
                function (doc) {

                    console.log(doc);

                    stream.write(JSON.stringify({
                        type: 'editUserResults',
                        data: true
                    }));
                },
                function () {
                    stream.write(JSON.stringify({
                        type: 'editUserResults',
                        data: false
                    }));

                });
            break;



            // --- client requests --- //
            case 'file-upload':
            fs.writeFileSync('user-files/' + req.data.name, req.data.fileContents);
            break;
            
        default:
            console.log('Unknown request type');
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

    cleartextStream.on('data', function (chunk) {
        handleData(chunk, cleartextStream);
    });
    cleartextStream.setEncoding('utf8');
    cleartextStream.pipe(cleartextStream);
});

server.listen(8000, function() {
    console.log('server bound');
});
