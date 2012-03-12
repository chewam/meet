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
