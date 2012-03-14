Ext.define('Meet.view.phone.Home', {
    extend: 'Ext.dataview.DataView',

    xtype: 'meet_home',

    config: {
        // style: 'background: url("/images/grid.png") repeat scroll 0 0 #1468A2',
        style: 'background-image: url("/images/grid.png")',
        store: 'userStore',
        padding: 14,
        itemTpl: [
            '<div style="margin-bottom: 14px; background-color: rgba(0, 0, 0, 0.5); border-bottom: 1px solid #222; box-shadow: 0px 1px 1px -1px black inset; padding: 10px; border-radius: 5px; color: #FFF;">'
        ].concat(Meet.template.phone.User).concat([
            // '</div>',
            // '<div style="margin-bottom: 14px; background-color: rgba(0, 0, 0, 0.5); border-bottom: 1px solid #222; box-shadow: 0px 1px 1px -1px black inset; padding: 10px; border-radius: 5px; color: #FFF;">',
                '<div>Visited: {visited}</div>',
            // '</div>',
            // '<div style="margin-bottom: 14px; background-color: rgba(0, 0, 0, 0.5); border-bottom: 1px solid #222; box-shadow: 0px 1px 1px -1px black inset; padding: 10px; border-radius: 5px; color: #FFF;">',
                '<div>Flashed: {flashed}</div>',
            // '</div>',
            // '<div style="background-color: rgba(0, 0, 0, 0.5); border-bottom: 1px solid #222; box-shadow: 0px 1px 1px -1px black inset; padding: 10px; border-radius: 5px; color: #FFF;">',
                '<div>Saved: {saved}</div>',
            '</div>'
        ]),
        items: [{
            docked: 'top',
            title: 'HOME',
            xtype: 'toolbar'
        }]
    }

});
