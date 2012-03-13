Ext.define('Meet.view.phone.Profile', {
    extend: 'Ext.TabPanel',

    xtype: 'meet_profile',

    requires: [
        'Meet.view.phone.profile.About',
        'Meet.view.phone.profile.Details',
        'Meet.view.phone.profile.Actions'
    ],

    config: {
        tabBar: {
            defaults: {flex: 1}
        },
        items: [{
            docked: 'top',
            title: 'PROFILE',
            xtype: 'toolbar',
            items: [{
                ui: 'back',
                text: 'Back',
                action: 'back'
            }, {
                xtype: 'spacer'
            }, {
                iconCls: 'action',
                action: 'action',
                iconMask: true
            }]
        }, {
            title: 'About',
            xtype: 'meet_profile_about',
        }, {
            title: 'Details',
            xtype: 'meet_profile_details'
        }, {
            title: 'Photos',
            html: 'photos...',
            padding: 14,
            style: 'background: #1468A2'
        }]
    },

    setData: function(data) {
        this.callParent(arguments);
        this.down('meet_profile_about').setData(data);
        this.down('meet_profile_details').setData(data);
    }

});
