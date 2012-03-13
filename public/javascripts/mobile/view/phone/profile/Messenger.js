Ext.define('Meet.view.phone.profile.Messenger', {
    extend: 'Ext.form.FormPanel',

    xtype: 'meet_profile_messenger',

    config: {
        autoRemove: true,
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
            docked: 'bottom',
            xtype: 'container',
            padding: '10',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [{
                ui: 'decline',
                xtype: 'button',
                text: 'Cancel',
                iconCls: 'ckeck1',
                iconMask: true,
                action: 'cancel'
            }, {
                ui: 'confirm',
                xtype: 'button',
                text: 'Send',
                iconCls: 'delete',
                iconMask: true,
                action: 'send',
                margin: '0 0 0 20'
            }]
        }]
    }

});
