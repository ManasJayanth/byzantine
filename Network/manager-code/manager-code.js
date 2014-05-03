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
//        userLogin();
        displayDashboard();
        
    } else {
        $('#body-container').html("Connection not authorized: " +
                                conn.authorizationError);
    }
});

conn.on("data", function (data) {
    handleData(data);
});


/* UI */
function handleData (buf) {
    var res = JSON.parse(buf.toString());
    if(typeof res.type === 'undefined') {
        console.log('Invalid request');
    } else {
        switch (res.type) {
        case 'loginSuccess':
            displayDashboard();
            break;

        case 'registrationSuccess':
            successfulRegistration();
            break;

        case 'editUserResults':
            processUserResults(res.data);
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

function displayDashboard () {
    var dashboardTemplate = $('#dashboard-template').html();
    $('#body-container').html(dashboardTemplate);

    $('.operation img').on('click', function () {
        var operationTemplate = $('#' + $(this).attr('data-op') +
                                  '-template').html();
        $('#workspace').html(operationTemplate);
    });

    $(document).on('click', '#new-user-submit', sendUserDetails);
    $(document).on('click', '#user-id-submit', sendUserID);
}

function sendUserDetails (event) {
    event.preventDefault();
    var formDataSerialized = $( this ).parent().serialize().split('&'),
        formObject = {};
    console.log(formDataSerialized);
    formDataSerialized.forEach(function (d) {
        var field = d.split('=');
        
        switch (typeof formObject[field[0]]) {
        case 'undefined':
            formObject[field[0]] = field[1];
            break;
        case 'string':
            var val = formObject[field[0]];
            formObject[field[0]] = [];
            formObject[field[0]].push(val);
            formObject[field[0]].push(field[1]);
            break;
        case 'array':
            formObject[field[0]].push(field[1]);
            break;
        }
    });
    var request = {
        type: 'userDetails',
        data: formObject
    };
    conn.write(JSON.stringify(request));
}

function successfulRegistration () {
    var regSuccessTemplate = $('#reg-success-template').html();
    $('#workspace').html(regSuccessTemplate);
}

function sendUserID (event) {
    event.preventDefault();
    var request = {
        type: 'editUser',
        data: $('#userID-search').val()
    };
    conn.write(JSON.stringify(request));
}

function processUserResults (data) {
    if (typeof data === 'string' && data === 'none') {
        var template = $('#empty-results-template').html();
        $('#edit-user-results-space').html(template);
    } else {
        var placeholderTemplate = $('#edit-user-results-template').html();
        var compiledTemplate = _.template(placeholderTemplate, data);
        $('#edit-user-results-space').html(compiledTemplate);
    }
}
