Ext.define('Meet.store.phone.UsersSaved', {

    extend: 'Ext.data.Store',

    config: {
        storeId: 'usersSavedStore',
        model: 'Meet.model.phone.User',
        proxy: {
            type: 'ajax',
            url : '/ws/user/getSaved',
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
