Ext.define('Meet.view.phone.Activity', {

    extend: 'Ext.TabPanel',

    xtype: 'meet_activity',

    requires: [
        'Meet.view.phone.activity.Flashed',
        'Meet.view.phone.activity.Visited',
        'Meet.view.phone.activity.FlashedBy',
        'Meet.view.phone.activity.VisitedBy'
    ],

    config: {
        tabBar: {
            ui: 'neutral'
        },
        tabBarPosition: 'bottom',
        items: [{
            docked: 'top',
            title: 'ACTIVITY',
            xtype: 'toolbar'
        }, {
            title: 'Visited',
            iconCls: 'action',
            xtype: 'meet_activity_visited',
            listeners: {
                painted: function(list) {
                    list.getStore().load();
                }
            }
        }, {
            title: 'Flashed',
            iconCls: 'action',
            xtype: 'meet_activity_flashed'
        }, {
            title: 'Visited by',
            iconCls: 'action',
            xtype: 'meet_activity_visitedby',
        }, {
            title: 'Flashed by',
            iconCls: 'action',
            xtype: 'meet_activity_flashedby'
        }]
    },

    initialize: function() {
        this.callParent(arguments);
        this.on('activeitemchange', this.onActiveItemChange, this);
    },

    onActiveItemChange: function(panel, newItem, oldItem) {
        console.log('onActiveItemChange', this, arguments);
        newItem.getStore().load();
    }

});
