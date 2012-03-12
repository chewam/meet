Ext.define('Meet.view.phone.Home', {
    extend: 'Ext.Container',

    xtype: 'meet_home',

    config: {
        layout: 'fit',
        // style: 'background: url("/images/188.gif") repeat #aabbcd',
        style: 'background: #1468A2',
        // masked: {
        //     // hidden: true,
        //     xtype: 'loadmask',
        //     message: 'Loading profile...'
        // },
        items: [{
            docked: 'top',
            title: 'HOME',
            xtype: 'toolbar'
        }, {
            // height: 100,
            xtype: 'dataview',
            store: 'userStore',
            padding: 16,
            // style: 'background-color: ; padding: 20px;'
            itemTpl: '<div style="background-color: #105483; padding: 10px; border-radius: 5px; color: #FFF;"><img src="{pic}" style="width:64px; height:64px; float:left;" /><div style="margin-left:70px;">{login}</div><div style="clear:both;"></div></div>'
        }]
    }

});
