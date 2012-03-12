Ext.define('Meet.profile.Phone', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'Phone',
        models: ['User'],
        stores: ['User', 'Users'],
        views: ['Main', 'Menu', 'Home', 'Login', 'Search'],
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