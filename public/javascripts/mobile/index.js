Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext': '/javascripts/sencha/src',
        'Ext.ux': '/javascripts/mobile/ux'
    }
});

Ext.application({
    name: 'Meet',

    glossOnIcon: false,

    icon: '/images/logo.png',
    phoneStartupScreen: '/images/screen.png',

    appFolder: '/javascripts/mobile',

    requires: ['Meet.utils.Events'],

    // views: ['Login'],

    // models: ['User'],

    // controllers: ['Main'],

    // stores: ['Products'],

    profiles: ['Phone'/*, 'Tablet'*/]

    // launch: function() {
        // Meet.utils.Events.init();
    //     console.log('launch 2', this, arguments);
    //     Ext.create('Ext.Container', {
    //         fullscreen: true,
    //         html: 'Hello World'
    //     });
    // }
});