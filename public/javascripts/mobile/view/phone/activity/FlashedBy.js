Ext.define('Meet.view.phone.activity.FlashedBy', {

    extend: 'Ext.List',

    xtype: 'meet_activity_flashedby',

    config: {
        store: 'usersFlashedByStore',
        itemTpl: Meet.template.phone.User,
        plugins: [{
            xclass: 'Ext.plugin.PullRefresh',
            pullRefreshText: 'Pull down to refresh !'
        }, {
            xclass: 'Ext.plugin.ListPaging',
            autoPaging: true
        }]
    }

});
