Ext.define('Meet.view.phone.Main', {
    extend: 'Meet.view.Main',

    config: {
        items: [{
            xtype: 'meet_home'
        }, {
            docked: 'bottom',
            xtype: 'toolbar',
            items: [{
                xtype: 'button',
                iconMask: true,
                iconCls: 'more',
                action: 'menu'
            }, {
                xtype: 'spacer'
            }, {
                xtype: 'button',
                iconMask: true,
                iconCls: 'bolt_side',
                action: 'notification'
            }]
        }]
    }

});
