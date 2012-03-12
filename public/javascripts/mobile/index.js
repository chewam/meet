Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext': '/javascripts/sencha/src',
        'Ext.ux': '/javascripts/mobile/ux'
    }
});

Ext.application({
    name: 'Meet',

    appFolder: '/javascripts/mobile',

    // views: ['Login'],

    // models: ['User'],

    // controllers: ['Main'],

    // stores: ['Products'],

    profiles: ['Phone'/*, 'Tablet'*/]

    // launch: function() {
    //     console.log('launch 2', this, arguments);
    //     Ext.create('Ext.Container', {
    //         fullscreen: true,
    //         html: 'Hello World'
    //     });
    // }
});