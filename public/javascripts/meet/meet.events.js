// IO EVENTS

Meet.events = (function() {
    var socket = io.connect('http://'+window.location.host);
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
