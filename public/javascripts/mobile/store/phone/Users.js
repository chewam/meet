Ext.define('Meet.store.phone.Users', {

    extend: 'Ext.data.Store',

    config: {
        storeId: 'usersStore',
        model: 'Meet.model.phone.User',
        proxy: {
            type: 'ajax',
            url : '/users',
            pageParam: 'pageIndex',
            limitParam: 'pageLimit',
            reader: {
                type: 'json',
                rootProperty: 'data',
                totalProperty: 'count'
            }
        }
    }

});
