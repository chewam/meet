var Meet = {};

Meet.search = function() {};

Meet.search.prototype.flash = function(btn, id) {
    console.log("FLASH", this, arguments);
    btn = $(btn);
    btn.button('loading');
    $.post('/users/' + id + '/flash', {toto: 42}, function() {
        console.log("callback", this, arguments);
        btn.button('complete');
        btn.addClass('disabled');
        btn.twipsy({
            fallback: 'flash ok'
        });
        btn.twipsy('show');
    });
};

Meet.search.prototype.write = function(id, login) {
    console.log("WRITE", this, arguments);
    $('#write-modal .modal-header span').html(login);
    $('#write-modal').modal({
        show: true,
        keyboard: true,
        backdrop: 'static'
    });
};

Meet.search.prototype.save = function(id) {
    console.log("SAVE", this, arguments);
};

Meet.search.prototype.closeWriteWindow = function() {
    console.log("closeWriteWindow", this, arguments);
    $('#write-modal').modal('hide');
};

$(function() { ko.applyBindings(new Meet.search()); });
