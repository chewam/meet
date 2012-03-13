Ext.define('Meet.profile.Phone', {
    extend: 'Ext.app.Profile',

    requires: ['Meet.template.phone.User'],

    config: {
        name: 'Phone',
        models: ['User'],
        stores: ['User', 'Users'],
        views: [/*'Meet.template.phone.User', */'Main'],
        controllers: ['Main']
    },

    isActive: function() {
        return true;
        // return Ext.os.is.Phone;
    },

    launch: function() {
        Ext.create('Meet.view.phone.Main');
        console.log('launch');
    }

});