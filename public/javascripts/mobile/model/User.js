Ext.define('Meet.model.User', {

    extend: 'Ext.data.Model',

    config: {
        fields: [
            'id',
            'login',
            'email',
            'pic',
            'saved',
            'visited',
            'flashed',
            'gender',
            'status',
            'country',
            'city',
            'zipcode',
            'range1',
            'range2',
            'ethnicity',
            'height',
            'weight',
            'bodytype',
            'diet',
            'smokes',
            'drinks',
            'drugs',
            'religion',
            'sign',
            'education',
            'job',
            'income',
            'offspring',
            'pets',
            'speaks',
            'q1',
            'lat',
            'lng',
            'birthdate',
            'age',
            {name: 'pics', convert: function(v) {
                return v ? v.split(',') : false;
            }}
        ]
    }
});
