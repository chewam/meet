Ext.define('Meet.store.phone.User', {

    extend: 'Ext.data.Store',

    config: {
        storeId: 'userStore',
        model: 'Meet.model.phone.User',
        proxy: {
            type: 'rest',
            url : '/ws/signIn',
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }

});
