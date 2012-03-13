Ext.define('Meet.store.phone.UsersVisited', {

    extend: 'Ext.data.Store',

    config: {
        storeId: 'usersVisitedStore',
        model: 'Meet.model.phone.User',
        proxy: {
            type: 'ajax',
            url : '/ws/user/getVisited',
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
