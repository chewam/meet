Ext.define('Meet.view.phone.Profile', {
    extend: 'Ext.TabPanel',

    xtype: 'meet_profile',

    requires: [
        'Meet.view.phone.profile.Pics',
        'Meet.view.phone.profile.About',
        'Meet.view.phone.profile.Details',
        'Meet.view.phone.profile.Actions',
        'Meet.view.phone.profile.Messenger'
    ],

    autoRemove: true,

    excludedFromAutoRemove: ['meet_profile_messenger'],

    config: {
        tabBar: {
            ui: 'light',
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
                iconCls: 'list',
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
            xtype: 'meet_profile_pics',
            // style: 'background: #1468A2'
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        // Ext.getStore('userStore').on('load', this.onStoreLoad, this);
        // this.on('activate', this.onActivate, this);
    },

    // onActivate: function() {
    //     console.log('onActivate', this, arguments);
        // this.callParent(arguments);
        // this.setActiveItem(0);
    // },

    // 
    // onStoreLoad: function() {
    //     console.warn('onStoreLoad', this, arguments);
    // },

    setData: function(data) {
        this.callParent(arguments);
        this.down('meet_profile_pics').setData(data);
        this.down('meet_profile_about').setData(data);
        this.down('meet_profile_details').setData(data);
    }

});
