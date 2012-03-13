Ext.define('Meet.view.Main', {

    extend: 'Ext.ux.CardPanel',

    xtype : 'meet_main',

    requires: [
        'Meet.view.phone.Home',
        'Meet.view.phone.Menu',
        'Meet.view.phone.Login',
        'Meet.view.phone.Search',
        'Meet.view.phone.Profile'
    ],

    config: {
        fullscreen: true,
        style: 'background: black'
    }

});
