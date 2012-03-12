Ext.define('Meet.controller.phone.Main', {
    extend: 'Ext.app.Controller',

    config: {
        before: {
            initHome: 'authenticate'
        },
        routes: {
            '': 'initHome'
        },
        refs: {
            mainPanel: 'meet_main',
            menuButton: 'button[action=menu]',
            loginButton: 'button[action=login]',
            homeMenuButton: 'meet_menu button[action=home]',
            searchMenuButton: 'meet_menu button[action=search]',
            menuPanel: {
                selector: 'meet_main meet_menu',
                xtype: 'meet_menu',
                autoCreate: true
            },
            homePanel: 'meet_main meet_home',
            // homePanel: {
            //     selector: 'meet_main meet_home',
            //     xtype: 'meet_home',
            //     autoCreate: true
            // },
            loginPanel: {
                selector: 'meet_main meet_login',
                xtype: 'meet_login',
                autoCreate: true
            },
            searchPanel: {
                selector: 'meet_main meet_search',
                xtype: 'meet_search',
                autoCreate: true
            },
        },
        control: {
            menuButton: {
                tap: 'showMenu'
            },
            loginButton: {
                tap: 'login'
            },
            searchMenuButton: {
                tap: 'showSearch'
            },
            homeMenuButton: {
                tap: 'showHome'
            }
        }
    },

    authenticate: function(action) {
        // this.getHomePanel().setMasked(true);
        Ext.getStore('userStore').load({
            scope: this,
            callback: function(records, operation, success) {
                this.getHomePanel().setMasked(false);
                if (success) {
                    action.resume();
                } else {
                    this.showLogin();
                }
            }
        });
    },

    login: function() {
        this.getLoginPanel().setMasked(true);
        this.getLoginPanel().submit({
            scope: this,
            method: 'POST',
            url: '/users/login',
            success: function(form, data) {
                Ext.getStore('userStore').setData(data);
                this.getLoginPanel().setMasked(false);
                this.removeLogin();
            },
            failure: function(form) {
                this.getLoginPanel().setMasked(false);
                Ext.Msg.alert('Error', 'Ooops, sorry server connot authenticate yourself!', function() {
                    form.reset();
                });
            }
        });
    },

    initHome: function() {
        console.log('initHome', this, arguments);
    },

    showHome: function() {
        console.log('showHome', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.getMainPanel().setActiveItem(this.getHomePanel());
    },

    showLogin: function() {
        console.log('showLogin', this, arguments);
        this.getMainPanel().setCoverAnimation('down');
        this.getMainPanel().setActiveItem(this.getLoginPanel());
    },

    showMenu: function() {
        console.log('showMenu', this.getMainPanel(), this.getMenuPanel());
        this.getMainPanel().setCoverAnimation('down');
        this.getMainPanel().setActiveItem(this.getMenuPanel());
    },

    showSearch: function() {
        console.log('showSearch', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.getMainPanel().setActiveItem(this.getSearchPanel());
        this.getSearchPanel().getStore().load();
    },

    removeLogin: function() {
        console.log('removeLogin', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        // this.getMainPanel().getLayout().setAnimation({
        //     type: 'slide',
        //     reveal: true,
        //     direction: 'up'
        // });
        this.showHome();
    }

});
