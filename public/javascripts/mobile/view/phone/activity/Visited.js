Ext.define('Meet.view.phone.activity.Visited', {

    extend: 'Ext.List',

    xtype: 'meet_activity_visited',

    config: {
        store: 'usersVisitedStore',
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
