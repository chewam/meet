Ext.ns('Meet.template.phone');

Meet.template.phone.User = [
    '<div class="tpl-user">',
        '<img src="{pic}" />',
        '<div>',
            '<h2>{login}</h2>',
            '<div>{age} / {gender} / {status} / {height} cm</div>',
            '<div>{city}, {country}</div>',
        '</div>',
        '<div style="clear:both;"></div>',
    '</div>'
];
