$(document).ready(function () {
    $('img.action').on ('click', function () {
        userAction($(this));
    });
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
        data: $(this).attr('id')
    })
        .done(function( response ) {
            
        });
}
