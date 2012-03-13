Ext.define('Meet.store.phone.UsersFlashed', {

    extend: 'Ext.data.Store',

    config: {
        storeId: 'usersFlashedStore',
        model: 'Meet.model.phone.User',
        proxy: {
            type: 'ajax',
            url : '/ws/user/getFlashed',
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
