Ext.define('Meet.store.phone.UsersFlashedBy', {

    extend: 'Ext.data.Store',

    config: {
        storeId: 'usersFlashedByStore',
        model: 'Meet.model.phone.User',
        proxy: {
            type: 'ajax',
            url : '/ws/user/getFlashedBy',
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
