Ext.define('Meet.view.phone.Search', {
    extend: 'Ext.List',

    xtype: 'meet_search',

    config: {
        store: 'usersStore',
        itemTpl: '<img src="{pic}" style="width:48px; height:48px; float:left;" /><div style="margin-left:60px;">{login}</div><div style="clear:both;"></div>',
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
        // showAnimation: {
        //     duration: 300,
        //     type: 'slide',
        //     direction: 'left'
        // }
    }

});
