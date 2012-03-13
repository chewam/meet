Ext.ns('Meet.template.phone');

Meet.template.phone.User = [
    '<img src="{pic}" style="width:48px; height:48px; float:left;" />',
    '<div style="margin-left:60px;">',
        '<h2>{login}</h2>',
        '<div>{age} / {gender} / {status} / {height} cm</div>',
        '<div>{city}, {country}</div>',
    '</div>',
    '<div style="clear:both;"></div>'
];
