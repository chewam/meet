Ext.define('Meet.view.phone.activity.VisitedBy', {

    extend: 'Ext.List',

    xtype: 'meet_activity_visitedby',

    config: {
        store: 'usersVisitedByStore',
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
