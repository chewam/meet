Ext.define('Meet.view.phone.profile.About', {
    extend: 'Ext.Container',

    xtype: 'meet_profile_about',

    config: {
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        style: 'background: #F5F5F5',
        tpl: [
            '<div style="margin-bottom: 14px; background-color: #EFEFEF; border-bottom: 1px solid #FFF; box-shadow: 0px -4px 9px -8px #000 inset; padding: 10px; color: #000;">'
        ].concat(Meet.template.phone.User).concat([
            '</div>',
            '<div style="margin: 14px">',
                '<p>{q1}</p>',
            '</div>'
        ])
    }

});
