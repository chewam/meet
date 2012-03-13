Ext.define('Meet.view.phone.Menu', {
    extend: 'Ext.Container',

    xtype: 'meet_menu',

    config: {
        autoRemove: true,
        style: 'background: #1468A2',
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
            text: 'Search',
            iconCls: 'search',
            action: 'search'
        }, {
            text: 'My Activity',
            iconCls: 'action',
            action: 'activity'
        }, {
            text: 'My Profile',
            iconCls: 'action',
            action: 'profile'
        }]
    }

});
