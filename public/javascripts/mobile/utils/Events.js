Ext.define('Meet.utils.Events', {

    singleton: true,

    mixins: ['Ext.mixin.Observable'],

    constructor: function(config) {
        this.initConfig(config);
    },

    init: function() {
        var socket = io.connect('http://'+window.location.host);
        socket.on('visit', Ext.bind(this.onVisit, this));
        socket.on('flash', Ext.bind(this.onFlash, this));
    },

    onVisit: function (data) {
        console.warn('onVisit', data);
        this.fireEvent('visit', data);
        // data.type = 'info';
        // data.title = 'Nouvelle visite';
        // Meet.Msg.show(data);
    },

    onFlash: function (data) {
        console.warn('onFlash', data);
        this.fireEvent('flash', data);
        // data.type = 'success';
        // data.title = 'Nouveau flash';
        // Meet.Msg.show(data);
    }

});