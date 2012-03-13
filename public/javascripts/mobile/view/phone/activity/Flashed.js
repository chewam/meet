Ext.define('Meet.view.phone.activity.Flashed', {

    extend: 'Ext.List',

    xtype: 'meet_activity_flashed',

    config: {
        store: 'usersFlashedStore',
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
