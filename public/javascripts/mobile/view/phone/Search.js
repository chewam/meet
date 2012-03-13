Ext.define('Meet.view.phone.Search', {
    extend: 'Ext.List',

    xtype: 'meet_search',

    // requires: ['Meet.template.phone.User'],

    config: {
        store: 'usersStore',
        // itemTpl: Meet.template.phone.User.getTpl(),
        itemTpl: Meet.template.phone.User,
        // itemTpl: [
        //     '<img src="{pic}" style="width:48px; height:48px; float:left;" />',
        //     '<div style="margin-left:60px;">',
        //         '<h2>{login}</h2>',
        //         '<div>{age} years old, {height} cm</div>',
        //         '<div>{city}, {country}</div>',
        //     '</div>',
        //     '<div style="clear:both;"></div>'
        // ],
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
        // onItemDisclosure: function() {
        //     console.log('onItemDisclosure', this, arguments);
        // }
    }

});
