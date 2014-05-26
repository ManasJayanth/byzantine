var tls = require('tls'),
    fs = require('fs'),
    user = require('./user-model');

var loggedInUsers = [];

function handleData (buf, stream) {

    var req = JSON.parse(buf.toString());
    if(typeof req.type === 'undefined') {
        console.log('Invalid request');
    } else {
        switch (req.type) {
        case 'auth':
            user.authenticate(req.name, req.password,
            function (doc) {
                console.log('Successful login')
                loggedInUsers.push({
                    userId: doc.userId,
                    timeOfLogin: new Date().toUTCString(),
                    perms: doc.perms
                });
                stream.write(JSON.stringify({
                    type: 'loginSuccess',
                    data: {
                        id: doc.userId,
                        perms: doc.perms
                    }
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
            fs.writeFileSync(__dirname + '/../user-files/' + req.data.name,
                             req.data.fileContents);
            break;

            case 'list-files':
            var files = fs.readdirSync(__dirname + '/../user-files/');
            stream.write(JSON.stringify({
                type: 'files-available',
                data: {
                    files: files
                }
            }));
            break;
            
            case 'download-request':
            var content;
            try {
                content = fs.readFileSync(__dirname + '/../user-files/' + req.data.name);
                console.log('*********** File contents ********');
                console.log(content.toString());
                stream.write(JSON.stringify({
                    type: 'download-response',
                    data: {
                        name: req.data.name,
                        fileContents: content.toString()
                    }
                }));

            } catch (err) {

                console.log(err);

                stream.write(JSON.stringify({
                    type: 'download-response',
                    data: {
                        data: 'error',
                        fileContents: 'error'
                    }
                }));
            }
            break;

            case 'list-users':
            stream.write(JSON.stringify({
                type: 'logged-in-users',
                data: loggedInUsers
            }));
            break;
            
        default:
            console.log('Unknown request type: ' + req.type);
            break;
        }
    }
}

var options = {
    key: fs.readFileSync('keys/server-key.pem'),
    cert: fs.readFileSync('keys/server-cert.pem'),

    // This is necessary only if using the client certificate authentication.
    requestCert: true,

    // This is necessary only if the client uses the self-signed certificate.
    ca: [ fs.readFileSync('keys/client-cert.pem') ]
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
