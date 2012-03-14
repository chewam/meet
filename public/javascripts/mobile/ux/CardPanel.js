Ext.define('Ext.ux.CardPanel', {
    extend: 'Ext.Panel',

    config: {

        layout: {
            type: 'card',
            animation: new Ext.fx.layout.card.Reveal()
        }

    },

    initialize: function() {
        this.callParent(arguments);
        this.on('activeitemchange', this.onActiveItemChange, this);
    },

    onActiveItemChange: function(panel, newItem, oldItem) {
        var me = this;

        if (oldItem.autoRemove && (oldItem.excludedFromAutoRemove || []).indexOf(newItem.xtype) === -1) {
            if (oldItem.blockAutoRemove) {
                if (oldItem.previousOldItem) {
                    console.warn('REMOVE PREVIOUS: ', oldItem.previousOldItem.xtype);
                    me.remove(oldItem.previousOldItem);
                }
            }
            if (!newItem.blockAutoRemove) {
                setTimeout(function() {
                    console.warn('REMOVE: ', oldItem.xtype);
                    me.remove(oldItem);
                }, 500);
            } else {
                newItem.previousOldItem = oldItem;
            }
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
    },

    setSlideAnimation: function(direction) {
        this.getLayout().setAnimation({
            type: 'slide',
            direction: direction || 'left'
        });
    }

});
