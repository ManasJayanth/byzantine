var tls = require('tls'),
fs = require('fs'),
config = require('./config'),
dir = config.path,
exec = require('child_process').exec,
child;

var client = {
    fraudCount: 0,
    can: function (operation) {
        return this.details.perms.indexOf(operation) !== -1 ? true: false;
    }
};

var options = {
    key: fs.readFileSync(dir + '/client/keys/client-key.pem'),
    cert: fs.readFileSync(dir + '/client/keys/client-cert.pem'),
    rejectUnauthorized: true,
    ca: [ fs.readFileSync(dir + '/server/keys/server-cert.pem') ]
};

var conn = tls.connect(8000, config.ip , options, function() {
    if (conn.authorized) {
        
        // Initialisation
        (function() {
            console.log('Initialising');
            var userFiles = dir + '/nw-builds/user-files/';
            if (!fs.existsSync(userFiles)) {
                console.log('Creating user-files directory');
                fs.mkdir(userFiles);
            }
        })();


        // --- Registering button click handlers --- //
        $(document).on('click', 'header div.pull-left', displayDashboard);
        $(document).on('click', '.operation img', renderOpTemplate);
        $(document).on('click', '#download-button', downloadFile);
        $(document).on('change', '#inputFile', handleFileSelect);
        $(document).on('click', '#inputFile', handleFileSelect);


        // --- Starting the application --- //
        userLogin();
    } else {
        $('#body-container').html("Connection not authorized: " +
                                  conn.authorizationError);
    }
});

conn.on("data", function (data) {
    handleData(data);
});

function handleData (buf) {

    var placeHolderTemplate, compiledTemplate;

    var res = JSON.parse(buf.toString());
    if(typeof res.type === 'undefined') {
        console.log('Invalid request');
    } else {
        switch (res.type) {
        case 'loginSuccess':
            client.details = $.extend({}, client.details, res.data);
            console.log(client);
            displayDashboard();
            break;

        case 'files-available':
            placeHolderTemplate = $('#file-download-template').html();
            compiledTemplate = _.template(placeHolderTemplate, res.data);
            $('#workspace').html(compiledTemplate);
            break;

        case 'download-response':
            if (res.data.fileContents === 'error') {
                console.log('error occured while downloading the file');
            } else {
		/* jshint ignore:start */
		try {
                    fs.writeFileSync(dir + '/nw-builds/user-files/' + res.data.name,
                                     res.data.fileContents);
                    $('#download-results').html('<div class="alert alert-success">' +
                       res.data.name + ' successfully downloaded </div>');
		} catch (err) {
		    console.log('Error occured while writing to file: ' + err);
                    $('#download-results').html('<div class="alert alert-danger">' +
                       res.data.name + ' could not be downloaded </div>');
		}
		/* jshint ignore:end */
            }
            break;

        case 'logged-in-users':
            placeHolderTemplate = $('#logged-in-users-template').html();
            compiledTemplate = _.template(placeHolderTemplate,
                                          {clients: res.data});
            $('#workspace').html(compiledTemplate);
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

function renderOpTemplate () {
    function alertUser (message) {
        var placeHolderTemplate = $('#operation-access-denied').html();
        var compiledTemplate = _.template(placeHolderTemplate,
                                          {message: message});
        $('#alert-space').html(compiledTemplate);
    }


    if (client.details.accessAllowed) {

        var op = $(this).attr('data-op');

        switch (op) {
        case 'file-download':
            if (client.can('download')) {
                conn.write(JSON.stringify({
                    type: 'list-files'
                })); // template will be rendered when the response 
                //'available-files' is received            
            } else {

                if (client.fraudCount++ > 3) {
                    client.details.accessAllowed = false;
                    conn.write(JSON.stringify({
                        type: 'deny-user',
                        data: {
                            id: client.details.userId
                        }
                    }));
                } else {

                    conn.write(JSON.stringify({
                        type: 'fraudulent-access',
                        data: {
                            id: client.details.userId,
                            op: 'download'
                        }
                    }));
                    alertUser('You donot have download access');
                }
            }
            break;
            
        case 'network-analysis':
            if (client.can('analyse')) {
                conn.write(JSON.stringify({
                    type: 'list-users'
                })); // template will be rendered when the response 
                //'logged-in-users' is received
            } else {

                if (client.fraudCount++ > 3) {
                    client.details.accessAllowed = false;
                    conn.write(JSON.stringify({
                        type: 'deny-user',
                        data: {
                            id: client.details.userId
                        }
                    }));
                } else {
                    conn.write(JSON.stringify({
                        type: 'fraudulent-access',
                        data: {
                            id: client.details.userId,
                            op: 'analysis'
                        }
                    }));
                    alertUser('You donot have access to network analysis');
                }
            }
            break;
            
        case 'file-upload':
            if (client.can('upload')) {
                var operationTemplate = $('#' + op + '-template').html();
                $('#workspace').html(operationTemplate);
            } else {

                if (client.fraudCount++ > 3) {
                    client.details.accessAllowed = false;
                    conn.write(JSON.stringify({
                        type: 'deny-user',
                        data: {
                            id: client.details.userId
                        }
                    }));
                } else {
                    conn.write(JSON.stringify({
                        type: 'fraudulent-access',
                        data: {
                            id: client.details.userId,
                            op: 'upload'
                        }
                    }));
                    alertUser('You donot have upload access');
                }
            }
            break;
        }
    } else {
        var placeHolderTemplate = $('#operation-access-denied').html();
        var compiledTemplate = _.template(placeHolderTemplate,
            {message: 'Your account has been blocked due to' +
             ' fradulent activity and your system will be ' +
             'shutdown in sometime'});
        $('#workspace').html(compiledTemplate);
        child = exec('shutdown now');
    }
    
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

function downloadFile () {
    conn.write(JSON.stringify({
        type: 'download-request',
        data: {
            name: $(this).attr('data-filename')
        }
    }));
}

function handleFileSelect (evt) {
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
}
