$(function() {

    // SEARCH
    var search = new Meet.search();

    $('.item').tooltip({selector: "a[rel=tooltip]"});
    $('.item a.btn').click(function() {
        search.onItemButtonClick($(this));
    });
    $('#write-modal .btn-primary').click(function() {
        search.sendMessage($(this));
    });


    // PROFILE
    $('form').submit(function() {
        var values = $(this).serialize();
        console.log('values', this.method, this.action, values);
        $.ajax({
            type: 'PUT',
            url: this.action,
            data: values,
            dataType: 'json',
            success: console.log,
            failure: console.log
        });
        return false;
    });

});
