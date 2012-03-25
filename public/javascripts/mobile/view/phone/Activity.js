Ext.define('Meet.view.phone.Activity', {

    extend: 'Ext.TabPanel',

    xtype: 'meet_activity',

    requires: [
        'Meet.view.phone.activity.Saved',
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
        //     title: 'Visited',
        //     iconCls: 'team1',
        //     xtype: 'meet_activity_visited',
        //     listeners: {
        //         painted: function(list) {
        //             list.getStore().load();
        //         }
        //     }
        // }, {
        //     title: 'Flashed',
        //     iconCls: 'bolt',
        //     xtype: 'meet_activity_flashed'
        // }, {
            title: 'Visitors',
            iconCls: 'team1',
            xtype: 'meet_activity_visitedby',
            listeners: {
                painted: function(list) {
                    list.getStore().load();
                }
            }
        }, {
            title: 'Flash',
            iconCls: 'bolt',
            xtype: 'meet_activity_flashedby'
        }, {
            title: 'Favorites',
            iconCls: 'heart',
            xtype: 'meet_activity_saved'
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
