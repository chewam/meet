var Meet = {};

// IO EVENTS

Meet.events = (function() {
    var socket = io.connect('http://localhost');
    socket.on('visit', function (data) {
        data.type = 'info';
        data.title = 'Nouvelle visite';
        Meet.Msg.show(data);
    });
    socket.on('flash', function (data) {
        data.type = 'success';
        data.title = 'Nouveau flash';
        Meet.Msg.show(data);
    });
})();


// MESSAGE

Meet.message = function() {};

Meet.message.prototype.show = function(data) {    
    var tmpl = [
        '<div class="alert alert-block alert-${type} fade in" id="alert-visit">',
            '<a class="close" href="#" data-dismiss="alert">×</a>',
            '<h4 class="alert-heading">${title}</h4>',
            '<div class="row">',
                '<div class="span1">',
                    '<a class="thumbnail" href="/profile/${id}"><img src="${pic}" /></a>',
                '</div>',
                '<div class="span3">',
                    '<h4><a href="/profile/${id}">${login}</a></h4>',
                    '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do fdf fds fdsfds f dsfdsfds.</p>',
                '</div>',
            '</div>',
        '</div>'
    ].join('');

    $.tmpl(tmpl, data).appendTo("body");
};

Meet.Msg = new Meet.message();

// SEARCH

Meet.search = function() {};

Meet.search.prototype.onItemButtonClick = function(btn) {

    var id = btn.attr('data-user-id'),
        type = btn.attr('data-original-title');

    if (!btn.hasClass('disabled')) this[type](id, btn);
};

Meet.search.prototype.flash = function(id, btn) {
    console.log("FLASH", this, arguments);
    // btn = $(btn);
    // $(btn).button('loading');
    $(btn).addClass('disabled');
    // btn.removeAttr('data-bind');
    $.post('/users/' + id + '/flash', {toto: 42}, function() {
        console.log("callback", this, arguments);
        // $(btn).button('complete');
        // $(btn).addClass('disabled');
        // btn.attr('disabled', 'disabled');
        // console.log('BUTTON', $(btn), $(btn).attr('class'));
        // btn.tooltip({
        //     fallback: 'flash ok'
        // });
        // btn.tooltip('show');
    });
};

Meet.search.prototype.write = function(id, btn) {
    console.log("WRITE", this, arguments);
    this.receiverId = id;
    var login = btn.attr('data-user-login');

    $('#write-modal .modal-header span').html(login);
    $('#write-modal input, #write-modal textarea').val('');
    $('#write-modal').modal({
        show: true,
        keyboard: true,
        backdrop: 'static'
    });
    setTimeout(function() {
        $('#write-modal input').focus();
    }, 500);
};

Meet.search.prototype.save = function(id, btn) {
    btn.addClass('disabled');
    $.post('/users/' + id + '/save', function() {
        console.log("callback", this, arguments);
    });
};

Meet.search.prototype.sendMessage = function(btn) {

    if (!this.receiverId) return;

    var me = this,
        error = false,
        input = $('#write-modal input'),
        textarea = $('#write-modal textarea'),
        title = input.val(),
        message = textarea.val();

    if (!title || !title.length) {
        error = true;
        input.parents('.control-group').addClass('error');
    } else {
        input.parents('.control-group').removeClass('error');
    }

    if (!message || !message.length) {
        error = true;
        textarea.parents('.control-group').addClass('error');
    } else {
        textarea.parents('.control-group').removeClass('error');
    }

    console.log('ERROR', error);

    if (!error) {
        $.post(
            '/users/' + this.receiverId + '/write',
            {title: title, message: message},
            function() {
                delete me.receiverId;
                input.val('');
                textarea.val('');
                me.closeWriteWindow();
            }
        );
    }

    console.log("sendMessage", title, message);
};

Meet.search.prototype.closeWriteWindow = function() {
    console.log("closeWriteWindow", this, arguments);
    $('#write-modal').modal('hide');
};

// $(function() { ko.applyBindings(new Meet.search()); });

$(function() {
    // $().alert();
    var search = new Meet.search();

    $('.item').tooltip({selector: "a[rel=tooltip]"});
    $('.item a.btn').click(function() {
        search.onItemButtonClick($(this));
    });
    $('#write-modal .btn-primary').click(function() {
        search.sendMessage($(this));
    });
});
