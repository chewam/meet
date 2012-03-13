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
            profileBackButton: 'meet_profile button[action=back]',
            profileActionButton: 'meet_profile button[action=action]',
            homePanel: 'meet_main meet_home',
            menuPanel: {
                selector: 'meet_main meet_menu',
                xtype: 'meet_menu',
                autoCreate: true
            },
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
            profilePanel: {
                selector: 'meet_main meet_profile',
                xtype: 'meet_profile',
                autoCreate: true
            }
            // profileActionsSheet: {
            //     selector: 'meet_main meet_profile',
            //     xtype: 'meet_profile_actions',
            //     autoCreate: true
            // }
        },
        control: {
            menuButton: {
                tap: 'onMenuButtonTap'
            },
            loginButton: {
                tap: 'login'
            },
            searchMenuButton: {
                tap: 'onSearchMenuButtonTap'
            },
            homeMenuButton: {
                tap: 'onHomeMenuButtonTap'
            },
            homePanel: {
                itemtap: 'onHomePanelItemTap'
            },
            searchPanel: {
                itemtap: 'onSearchPanelItemTap'
            },
            profileBackButton: {
                tap: 'onProfileBackButtonTap'
            },
            profileActionButton: {
                tap: 'onProfileActionButton'
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
        Ext.getStore('userStore').load({
            scope: this,
            params: this.getLoginPanel().getValues(),
            callback: function(records, operation, success) {
                this.getLoginPanel().setMasked(false);
                if (success) {
                    // Ext.getStore('userStore').setData(response.data);
                    // this.getLoginPanel().setMasked(false);
                    this.removeLogin();
                } else {
                    Ext.Msg.alert('Error', 'Ooops, sorry server connot authenticate yourself!', function() {
                        form.reset();
                    });
                }
            }
        });
    },

    initHome: function() {
        console.log('initHome', this, arguments);
    },

    showHome: function() {
        console.log('showHome', this, arguments);
        // this.getMainPanel().setRevealAnimation('up');
        this.getMainPanel().setActiveItem(this.getHomePanel());
    },

    showLogin: function() {
        console.log('showLogin', this, arguments);
        this.getMainPanel().setCoverAnimation('down');
        this.getMainPanel().setActiveItem(this.getLoginPanel());
    },

    showMenu: function(lastActiveItem) {
        console.log('showMenu', this.getMainPanel(), this.getMenuPanel());
        this.getMainPanel().setCoverAnimation('down');
        this.getMainPanel().lastActiveItem = lastActiveItem;
        this.getMainPanel().setActiveItem(this.getMenuPanel());
    },

    hideMenu: function() {
        console.log('hideMenu', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.getMainPanel().setActiveItem(this.getMainPanel().lastActiveItem);
    },

    showSearch: function() {
        console.log('showSearch', this, arguments);
        this.getMainPanel().setActiveItem(this.getSearchPanel());
    },

    removeLogin: function() {
        console.log('removeLogin', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.showHome();
    },

    showProfile: function(data, callback) {
        console.log('showProfile', this, arguments);
        this.getMainPanel().setSlideAnimation('left');
        this.getProfilePanel().callback = callback || Ext.emptyFn;
        this.getMainPanel().setActiveItem(this.getProfilePanel());
        if (data) {
            this.getProfilePanel().setData(data);
        }
    },

    onMenuButtonTap: function() {
        console.log('onMenuButtonTap', this, arguments);
        var item = this.getMainPanel().getActiveItem();
        if (item.isXType('meet_menu')) {
            this.hideMenu();
        } else {
            this.showMenu(item);
        }
    },

    onHomeMenuButtonTap: function() {
        console.log('onHomeMenuButtonTap', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.showHome();
    },

    onHomePanelItemTap: function() {
        console.log('onHomePanelItemTap', this, arguments);
        var record = Ext.getStore('userStore').first();
        this.showProfile(record.data, this.showHome);
    },

    onSearchPanelItemTap: function(list, index) {
        var record = Ext.getStore('usersStore').getAt(index);
        console.log('onSearchPanelItemTap', record);
        this.showProfile(record.data, this.showSearch);
    },

    onSearchMenuButtonTap: function() {
        console.log('onSearchMenuButtonTap', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.showSearch();
        this.getSearchPanel().getStore().load();
    },

    onProfileBackButtonTap: function() {
        console.log('onProfileBackButtonTap', this, arguments);
        this.getMainPanel().setSlideAnimation('right');
        this.getProfilePanel().callback.call(this);
    },

    onProfileActionButton: function() {
        var sheet = Ext.create('Meet.view.phone.profile.Actions');
        console.log('onProfileActionButton', sheet);
        Ext.Viewport.add(sheet);
        sheet.show();
        // this.getProfileActionsSheet().show();
    }

});
