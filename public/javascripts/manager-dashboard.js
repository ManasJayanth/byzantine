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
}

function deleteUser () {
    // render form
    var template = _.template($('#delete-user-form').html());
    $('#manager-workspace').html(template);

}

function createUser() {    
    // render form
    var template = _.template($('#register-user-id').html());
    $('#manager-workspace').html(template);
}
