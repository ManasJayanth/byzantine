var tls = require('tls'),
    fs = require('fs'),
    dir = require('./config').path;

var options = {
    key: fs.readFileSync(dir + '/client-keys/client-key.pem'),
    cert: fs.readFileSync(dir + '/client-keys/client-cert.pem'),
    rejectUnauthorized: true,
    ca: [ fs.readFileSync(dir + '/server-keys/server-cert.pem') ]
};

var conn = tls.connect(8000, '127.0.0.1', options, function() {
    if (conn.authorized) {

        $(document).on('click', '.operation img', function () {
            var op = $(this).attr('data-op');
            if (op === 'file-download') {
                conn.write(JSON.stringify({
                    type: 'list-files'
                })); // template will be rendered when the response 
                //'available-files' is received
            } else {
                var operationTemplate = $('#' + op + '-template').html();
                $('#workspace').html(operationTemplate);
            }
        });
        
        $(document).on('click', '#download-button', function () {
            conn.write(JSON.stringify({
                type: 'download-request',
                data: {
                    name: $(this).attr('data-filename')
                }
            }));
        });

        // userLogin();
        displayDashboard();

        var handleFileSelect = function (evt) {
            var files = evt.target.files; // FileList object
            var reader = new FileReader();

            for (var i = 0, f = files[i]; i < files.length; i++) {
                reader.readAsBinaryString(f);

                /* jshint ignore:start */
                reader.onload = (function(theFile) {
                    return function(e) {
                        nwUploadFile(theFile.name, theFile.path);
                    };
                })(f);
                /* jshint ignore:end */

            }
        };


        $(document).on('change', '#inputFile', handleFileSelect);
        $(document).on('click', '#inputFile', handleFileSelect);

    } else {
        $('#body-container').html("Connection not authorized: " +
                                  conn.authorizationError);
    }
});

conn.on("data", function (data) {
    handleData(data);
});


function handleData (buf) {
    var res = JSON.parse(buf.toString());
    if(typeof res.type === 'undefined') {
        console.log('Invalid request');
    } else {
        switch (res.type) {
        case 'loginSuccess':
            displayDashboard();
            break;

        case 'files-available':
            var placeHolderTemplate = $('#file-download-template').html();
            var compiledTemplate = _.template(placeHolderTemplate, res.data);
            $('#workspace').html(compiledTemplate);
            break;

        case 'download-response':
            if (res.data.fileContents === 'error') {
                console.log('error occured while downloading the file');
            } else {
                console.log(res.data);
//                fs.writeFileSync(res.data.name, res.data.fileContents);
            }
            break;

        default:
            console.log('Unknown request type: ' + res.type);
            break;
        }
    }
}

function userLogin () {
    console.log('Connection authorized by a Certificate Authority.');
    var loginTemplate = $('#login-template').html();
    $('#body-container').html(loginTemplate);

    //--- UI Event ---//
    $('#client-login-submit').on('click', function () {
        conn.write(JSON.stringify({
            name: $('#userId').val(),
            password: $('#password').val(),
            type: 'auth'
        }));
    });
}

function displayDashboard () {
    var dashboardTemplate = $('#dashboard-template').html();
    $('#body-container').html(dashboardTemplate);
}

function nwUploadFile (name, path) {
    var fileContents = fs.readFileSync(path);
    conn.write(JSON.stringify({
        data: {
            name: name,
            fileContents: fileContents.toString()
        },
        type: 'file-upload'
    }));
}
