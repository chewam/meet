Ext.define('Meet.view.phone.profile.Actions', {
    extend: 'Ext.ActionSheet',

    xtype: 'meet_profile_actions',

    config: {
        hideOnMaskTap: true,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        defaults: {
            flex: 1,
            ui: 'small',
            xtype: 'button',
            iconMask: true,
            iconAlign: 'top',
            margin: '0 10 0 0'
        },
        items: [{
            iconCls: 'mail',
            text: 'MESSAGE',
            action: 'message'
        }, {
            text: 'FLASH',
            action: 'flash',
            iconCls: 'bolt'
        }, {
            text: 'SAVE',
            action: 'save',
            iconCls: 'heart',
            margin: 0
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        // WTF: cannot use this.mon() ???
        this.on('hide', this.onHide, this);
    },

    onHide: function() {
        this.destroy();
    }

});
