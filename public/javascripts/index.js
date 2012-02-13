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

Meet.search.prototype.flash = function(btn, id) {
    console.log("FLASH", this, arguments);
    // btn = $(btn);
    // $(btn).button('loading');
    $(btn).addClass('disabled');
    // btn.removeAttr('data-bind');
    $.post('/users/' + id + '/flash', {toto: 42}, function() {
        console.log("callback", this, arguments, $(btn));
        // $(btn).button('complete');
        // $(btn).addClass('disabled');
        // btn.attr('disabled', 'disabled');
        console.log('BUTTON', $(btn), $(btn).attr('class'));
        // btn.tooltip({
        //     fallback: 'flash ok'
        // });
        // btn.tooltip('show');
    });
};

Meet.search.prototype.write = function(id, login) {
    console.log("WRITE", this, arguments);
    this.receiverId = id;
    $('#write-modal .modal-header span').html(login);
    $('#write-modal').modal({
        show: true,
        keyboard: true,
        backdrop: 'static'
    });
    setTimeout(function() {
        $('#write-modal input').focus();
    }, 500);
};

Meet.search.prototype.save = function(btn, id) {
    console.log("SAVE", this, arguments);
    btn = $(btn);
    // btn.button('loading');
    $.post('/users/' + id + '/save', function() {
        console.log("callback", this, arguments);
        // btn.button('complete');
        btn.addClass('disabled');
        // btn.tooltip({
        //     fallback: 'save ok'
        // });
        // btn.tooltip('show');
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
        input.parents('.clearfix').addClass('error');
    } else {
        input.parents('.clearfix').removeClass('error');
    }

    if (!message || !message.length) {
        error = true;
        textarea.parents('.clearfix').addClass('error');
    } else {
        textarea.parents('.clearfix').removeClass('error');
    }

    if (!error) {
        btn = $(btn);
        btn.button('loading');

        $.post(
            '/users/' + this.receiverId + '/write',
            {title: title, message: message},
            function() {
                delete me.receiverId;
                btn.button('complete');
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

$(function() { ko.applyBindings(new Meet.search()); });

$(function() { $().alert(); });
