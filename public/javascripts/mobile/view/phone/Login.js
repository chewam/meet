Ext.define('Meet.view.phone.Login', {
    extend: 'Ext.form.FormPanel',

    xtype: 'meet_login',

    config: {
        masked: {
            hidden: true,
            xtype: 'loadmask',
            message: 'Authentication...'
        },
        items: [{
            xtype: 'fieldset',
            title: 'Aunthentication',
            instructions: 'use your login & password to authenticate yourself',
            items: [{
                xtype: 'textfield',
                name: 'login',
                label: 'Login',
                autoCapitalize: false,
                value: 'gary'
            }, {
                xtype: 'passwordfield',
                name: 'password',
                label: 'Password',
                value: 'pass'
            }]
        }, {
            xtype: 'button',
            text: 'Sign In',
            action: 'login'
        }]
    }

});