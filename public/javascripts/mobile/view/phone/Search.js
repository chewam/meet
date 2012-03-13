Ext.define('Meet.view.phone.Search', {

    extend: 'Ext.List',

    xtype: 'meet_search',

    config: {
        store: 'usersStore',
        itemTpl: Meet.template.phone.User,
        items: [{
            docked: 'top',
            xtype: 'toolbar',
            title: 'SEARCH'
        }],
        plugins: [{
            xclass: 'Ext.plugin.PullRefresh',
            pullRefreshText: 'Pull down to refresh !'
        }, {
            xclass: 'Ext.plugin.ListPaging',
            autoPaging: true
        }]
    }

});
