Ext.define('Meet.view.phone.Menu', {
    extend: 'Ext.Container',

    xtype: 'meet_menu',

    autoRemove: true,

    blockAutoRemove: true,

    config: {
        defaults: {
            // ui: 'action',
            xtype: 'button',
            iconMask: true,
            iconAlign: 'top',
            style: 'float: left; margin: 20px; width: 37%'
        },
        items: [{
            docked: 'top',
            ui: 'dark',
            xtype: 'toolbar',
            title: 'NAVIGATION',
            style: undefined
        }, {
            // ui: 'light',
            text: 'Home',
            iconCls: 'home',
            action: 'home'
        }, {
            // ui: 'neutral',
            text: 'My Profile',
            iconCls: 'user',
            action: 'profile'
        }, {
            // ui: 'dark',
            text: 'Search',
            iconCls: 'search1',
            action: 'search'
        }, {
            // ui: 'confirm',
            text: 'My Activity',
            iconCls: 'time',
            action: 'activity'
        }]
    }

});
