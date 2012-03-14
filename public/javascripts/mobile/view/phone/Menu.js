Ext.define('Meet.view.phone.Menu', {
    extend: 'Ext.Container',

    xtype: 'meet_menu',

    autoRemove: true,

    blockAutoRemove: true,

    config: {
        defaults: {
            ui: 'action',
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
            text: 'Home',
            iconCls: 'home',
            action: 'home'
        }, {
            text: 'My Profile',
            iconCls: 'user',
            action: 'profile'
        }, {
            text: 'Search',
            iconCls: 'search1',
            action: 'search'
        }, {
            text: 'My Activity',
            iconCls: 'time',
            action: 'activity'
        }]
    }

});
