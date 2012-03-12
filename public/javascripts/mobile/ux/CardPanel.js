Ext.define('Ext.ux.CardPanel', {
    extend: 'Ext.Panel',

    config: {

        layout: {
            type: 'card',
            animation: new Ext.fx.layout.card.Reveal()
        }

    },

    setCoverAnimation: function(direction) {
        this.getLayout().setAnimation(
            new Ext.fx.layout.card.Cover({
                direction: direction || 'left'
            })
        );
    },

    setRevealAnimation: function(direction) {
        this.getLayout().setAnimation(
            new Ext.fx.layout.card.Reveal({
                direction: direction || 'left'
            })
        );
    }

});
