Ext.define('Meet.view.phone.profile.Messenger', {

    extend: 'Ext.form.FormPanel',

    xtype: 'meet_profile_messenger',

    autoRemove: true,

    config: {
        style: 'background: #1468A2',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [{
            docked: 'top',
            xtype: 'toolbar',
            title: 'MESSENGER',
            items: [{
                ui: 'back',
                text: 'back',
                action: 'back'
            }]
        }, {
            flex: 1,
            name: 'message',
            labelAlign: 'top',
            xtype: 'textareafield',
            label: 'Your message:'
        }, {
            ui: 'light',
            docked: 'bottom',
            xtype: 'toolbar',
            // padding: '10',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [{
                ui: 'decline',
                xtype: 'button',
                text: 'CANCEL',
                iconCls: 'delete',
                iconMask: true,
                action: 'cancel'
            }, {
                ui: 'confirm',
                xtype: 'button',
                text: 'SEND',
                iconCls: 'check1',
                iconMask: true,
                action: 'send',
                margin: '0 0 0 20'
            }]
        }]
    }

});
