Ext.define('Meet.model.phone.User', {

    extend: 'Ext.data.Model',

    config: {
        fields: ['id', 'login', 'email', 'pic', 'saved', 'visited', 'flashed']
    }
});
