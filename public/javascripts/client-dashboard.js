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
}
