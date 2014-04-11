$(document).ready(function () {
    $('.sidebar li a').on('click', function () {
        
        // Marking all menu items as inactive
        $('.sidebar li').each(function () {
            $(this).removeClass('active');
        });

        // Highlighting current item
        $(this).parent().addClass('active');
        menuClicked($(this).attr('id'));
    });

    menuClicked('create-user');
});

function menuClicked (item) {
    switch (item) {
        case 'fraud-logs':
        fraudulentLogs();
        break;
        
        case 'delete-user':
        deleteUser();
        break;

        case 'create-user':
        createUser();
        break;
    }
}

function fraudulentLogs () {
    console.log('fraud');
    var template = _.template($('#user-logs').html());
    $('#manager-workspace').html(template);
}

function deleteUser () {
    // render form
    var template = _.template($('#delete-user-form').html());
    $('#manager-workspace').html(template);

    $('#user-deletion').bind('submit', function (e) {
        e.preventDefault();
        $.post(this.action, $(this).serialize())
            .done(function () {
                console.log('user-creation: form data submitted successfully');
                $('.user-alert').html('<div class="alert alert-success"> ' +
                                      'User successfully deleted</div>')
            })
            .fail(function () {
                $('.user-alert').html('<div class="alert alert-danger"> ' + 
                                      'Error occured </div>')
                console.log('user-creation: error occured while deleting' +
                            'user');
            });

        return false;
    });
}

function createUser() {    
    // render form
    var template = _.template($('#register-user-id').html());
    $('#manager-workspace').html(template);
    $('#user-creation').bind('submit', function (e) {
        e.preventDefault();
        $.post(this.action, $(this).serialize())
            .done(function () {
                console.log('user-creation: form data submitted successfully');
                $('.user-alert').html('<div class="alert alert-success"> ' +
                                      'User successfully created</div>')
            })
            .fail(function () {
                $('.user-alert').html('<div class="alert alert-danger"> Error occured </div>')
                console.log('user-creation: error occured while form data' +
                      'submission');
            });

        return false;
    });
}
