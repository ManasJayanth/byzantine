$(document).ready(function () {
    $(document).on('click', 'img.action', function () {
        userAction($(this));
    });

    $(document).on('click', '#back-to-menu', function () {
        renderUI('main');
    });

    // TODO - form validation - empty filenames must be handled
    $(document).on('submit', '#file-upload', function (e) {
        $(this).ajaxSubmit({
            target: '.user-alert',
            url: this.action,
            success:    function() { 
                
            }
        }); 
        return false; 
    });

    renderUI('main');
});

function userAction (selection) {

    // Styling
    $('img.action').each (function () {
        $(this).css('background-color', 'white');
    });
    selection.css('background-color', '#006dcc');

    // Issue request
    $.ajax({
        type: "POST",
        url: "/user-request",
        data: {
            reqType: selection.attr('id')
        }
    })
    .done(function( response ) {
        renderUI(selection.attr('id').substring(4));
        $('.user-alert').html('<div class="alert alert-success"> ' +
                                      'Operation allowed </div>')
    })
    .fail(function (response) {
        if (response.responseText === 'blocked') {
            $('.user-alert').html('<div class="alert alert-danger"> ' +
                                  'You have exceeded the limit. Your account ' +
                                  'has been scheduled for deletion </div>')
        } else {
            $('.user-alert').html('<div class="alert alert-danger"> ' +
                                  'Illegal operation</div>')
        }
    });
}

function renderUI (userOp) {
    console.log(userOp);
    var template = $('#' + userOp +'-template').html();
    $('#client-workspace').html(template);
}
