Ext.define('Meet.store.phone.User', {

    extend: 'Ext.data.Store',

    config: {
        storeId: 'userStore',
        model: 'Meet.model.phone.User',
        proxy: {
            type: 'ajax',
            url : '/users/isLogged',
            reader: {
                type: 'json',
                rootProperty: 'data',
                // totalProperty: 'count'
            }
        }
    }

});
