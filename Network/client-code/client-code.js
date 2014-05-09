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
        // userLogin();
        displayDashboard();

        var handleFileSelect = function (evt) {
            var files = evt.target.files; // FileList object


            var reader = new FileReader();



            // files is a FileList of File objects. List some properties.
            var output = [];
            for (var i = 0, f = files[i]; i < files.length; i++) {

                
                // var lastModDate = f.lastModifiedDate ? f.lastModifiedDate
                //         .toLocaleDateString() : 'n/a';

                // output.push('<li><strong>', f.name ,
                //             '</strong> (', f.type || 'n/a', ') - ',
                //             f.size, ' bytes, last modified: ',
                //             lastModDate,
                //             '</li>');

                reader.readAsBinaryString(f);

                /* jshint ignore:start */
                reader.onload = (function(theFile) {
                    return function(e) {
                        nwUploadFile(theFile.name, theFile.path);
                        console.log(theFile.path);
                    };
                })(f);
                /* jshint ignore:end */

            }
        };


        $(document).on('change', '#inputFile', handleFileSelect);

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

    $('.operation img').on('click', function () {
        var operationTemplate = $('#' + $(this).attr('data-op') +
                                  '-template').html();
        $('#workspace').html(operationTemplate);
    });
}

function nwUploadFile (name, path) {
    var fileContents = fs.readFileSync(path);
    conn.write(JSON.stringify({
        data: {
            name: name,
            contents: fileContents
        },
        type: 'file-upload'
    }));
}
