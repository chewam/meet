Ext.define('Meet.view.phone.Menu', {
    extend: 'Ext.Container',

    xtype: 'meet_menu',

    config: {
        style: 'background: pink',
        // showAnimation: {
        //     duration: 300,
        //     cover: true,
        //     easing: 'ease-in-out',
        //     type: 'slide',
        //     direction: 'down'
        // },
        defaults: {
            xtype: 'button',
            useIconMask: true
        },
        items: [{
            text: 'Search',
            action: 'search'
        }, {
            text: 'My Activity',
            action: 'activity'
        }, {
            text: 'My Profile',
            action: 'profile'
        }, {
            text: 'Home',
            action: 'home'
        }]
    }

});
