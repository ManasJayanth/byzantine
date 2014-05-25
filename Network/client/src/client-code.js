var tls = require('tls'),
    fs = require('fs'),
    config = require('./config'),
    dir = config.path;

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
       //  displayDashboard(); //Only for testing
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
    var op = $(this).attr('data-op');
    if (op === 'file-download') {
        conn.write(JSON.stringify({
            type: 'list-files'
        })); // template will be rendered when the response 
        //'available-files' is received
    } else if (op === 'network-analysis') {
        conn.write(JSON.stringify({
            type: 'list-users'
        })); // template will be rendered when the response 
        //'logged-in-users' is received
    }else {
        var operationTemplate = $('#' + op + '-template').html();
        $('#workspace').html(operationTemplate);
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
