Ext.define('Meet.view.phone.profile.Actions', {
    extend: 'Ext.ActionSheet',

    xtype: 'meet_profile_actions',

    config: {
        hideOnMaskTap: true,
        items: [{
            text: 'Send a message'
        }, {
            text: 'Flash'
        }, {
            text: 'Save'
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
