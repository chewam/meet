Ext.define('Meet.view.phone.profile.Details', {
    extend: 'Ext.Container',

    xtype: 'meet_profile_details',

    config: {
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        tpl: [
            '<table>',
                '<tr><td>Ethnicity</td><td>{ethnicity}</td></tr>',
                '<tr><td>Age</td><td>{age}</td></tr>',
                '<tr><td>Body Type</td><td>{bodytype}</td></tr>',
                '<tr><td>Height</td><td>{height}</td></tr>',
                '<tr><td>Weight</td><td>{weight}</td></tr>',
                '<tr><td>Speaks</td><td>{speaks}</td></tr>',
                '<tr><td>Religion</td><td>{religion}</td></tr>',
                '<tr><td>Sign</td><td>{sign}</td></tr>',

                '<tr><td>Status</td><td>{status}</td></tr>',
                '<tr><td>Offspring</td><td>{offspring}</td></tr>',
                '<tr><td>Education</td><td>{education}</td></tr>',
                '<tr><td>Job</td><td>{job}</td></tr>',
                '<tr><td>Income</td><td>{income}</td></tr>',
                '<tr><td>Pets</td><td>{pets}</td></tr>',
                '<tr><td>Diet</td><td>{diet}</td></tr>',
                '<tr><td>Smokes</td><td>{smokes}</td></tr>',
                '<tr><td>Drinks</td><td>{drinks}</td></tr>',
                '<tr><td>Drugs</td><td>{drugs}</td></tr>',
            '</table>'
            // '{[this.listValues(values)]}',
            // {
            //     compiled: true,
            //     listValues: function(values) {
            //         var html = [];
            //         for (var key in values) {
            //             html = values[key];
            //         }
            //         return html.join(',');
            //     }
            // }
        ]
    }

});
