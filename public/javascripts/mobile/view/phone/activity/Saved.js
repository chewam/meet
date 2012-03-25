Ext.define('Meet.view.phone.activity.Saved', {

    extend: 'Ext.List',

    xtype: 'meet_activity_saved',

    config: {
        store: 'usersSavedStore',
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
