Ext.define('Meet.view.phone.profile.Pics', {
    extend: 'Ext.Carousel',

    xtype: 'meet_profile_pics',

    config: {
        // scrollable: {
        //     direction: 'vertical',
        //     directionLock: true
        // },
        style: 'background-color: #111;'
    },

    setData: function(data) {
        var images = [];
        console.log('setData', this, arguments);
        // this.callParent(arguments);
        this.removeAll();
        if (data.pics && data.pics.length) {
            for (var i = 0, l = data.pics.length; i < l; i++) {
                images.push({
                    xtype: 'image',
                    src: '/ws/user/pic/' + data.pics[i],
                    style: 'background-size: contain; background-position: center; background-color: #111;'
                });
            }
            this.add(images);
            this.enable();
        } else {
            this.disable();
        }
    }

});
