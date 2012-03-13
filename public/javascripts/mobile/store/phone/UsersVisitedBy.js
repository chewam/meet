Ext.define('Meet.store.phone.UsersVisitedBy', {

    extend: 'Ext.data.Store',

    config: {
        storeId: 'usersVisitedByStore',
        model: 'Meet.model.phone.User',
        proxy: {
            type: 'ajax',
            url : '/ws/user/getVisitedBy',
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
