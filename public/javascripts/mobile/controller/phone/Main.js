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
            menuButton: 'meet_main button[action=menu]',
            notificationButton: 'meet_main button[action=notification]',
            loginButton: 'meet_login button[action=login]',
            homeMenuButton: 'meet_menu button[action=home]',
            searchMenuButton: 'meet_menu button[action=search]',
            profileMenuButton: 'meet_menu button[action=profile]',
            activityMenuButton: 'meet_menu button[action=activity]',
            profileBackButton: 'meet_profile button[action=back]',
            profileActionButton: 'meet_profile button[action=action]',
            profileSaveButton: 'meet_profile_actions button[action=save]',
            profileFlashButton: 'meet_profile_actions button[action=flash]',
            profileMessageButton: 'meet_profile_actions button[action=message]',
            messengerBackButton: 'meet_profile_messenger button[action=back]',
            homePanel: 'meet_main meet_home',
            activityList: 'meet_main meet_activity list',
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
            activityPanel: {
                selector: 'meet_main meet_activity',
                xtype: 'meet_activity',
                autoCreate: true
            },
            profilePanel: {
                selector: 'meet_main meet_profile',
                xtype: 'meet_profile',
                autoCreate: true
            },
            messengerPanel: {
                selector: 'meet_main meet_profile meet_profile_messenger',
                xtype: 'meet_profile_messenger',
                autoCreate: true
            }
        },
        control: {
            menuButton: {
                tap: 'onMenuButtonTap'
            },
            loginButton: {
                tap: 'login'
            },
            notificationButton: {
                tap: 'onNotificationButtonTap'
            },
            searchMenuButton: {
                tap: 'onSearchMenuButtonTap'
            },
            homeMenuButton: {
                tap: 'onHomeMenuButtonTap'
            },
            profileMenuButton: {
                tap: 'onProfileMenuButtonTap'
            },
            activityMenuButton: {
                tap: 'onActivityMenuButtonTap'
            },
            homePanel: {
                itemtap: 'onHomePanelItemTap'
            },
            searchPanel: {
                itemtap: 'onSearchPanelItemTap'
            },
            activityList: {
                itemtap: 'onActivityListItemTap'
            },
            profileBackButton: {
                tap: 'onProfileBackButtonTap'
            },
            profileActionButton: {
                tap: 'onProfileActionButtonTap'
            },
            profileSaveButton: {
                tap: 'onProfileSaveButtonTap'
            },
            profileFlashButton: {
                tap: 'onProfileFlashButtonTap'
            },
            profileMessageButton: {
                tap: 'onProfileMessageButtonTap'
            },
            messengerBackButton: {
                tap: 'onMessengerBackButtonTap'
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
                    this.initIOEvents();
                    action.resume();
                    this.removeStartupScreen();
                } else {
                    this.removeStartupScreen(this.showLogin);
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
                    this.initIOEvents();
                    this.removeLogin();
                } else {
                    Ext.Msg.alert('Error', 'Ooops, sorry server connot authenticate yourself!', function() {
                        form.reset();
                    });
                }
            }
        });
    },

    flash: function() {
        var id = this.getProfilePanel().getData().id;

        Ext.Ajax.request({
            scope: this,
            url: '/ws/users/'+id+'/flash',
            callback: function() {
                console.warn('FLASH CALLBACK', arguments);
                this.hideActionsSheet();
            }
        });
    },

    visit: function(id) {
        Ext.Ajax.request({
            scope: this,
            url: '/ws/users/'+id+'/visit',
            callback: function() {
                console.warn('VISIT CALLBACK', arguments);
            }
        });
    },

    save: function() {
        var id = this.getProfilePanel().getData().id;

        Ext.Ajax.request({
            scope: this,
            url: '/ws/users/'+id+'/save',
            callback: function() {
                console.warn('SAVE CALLBACK', arguments);
                this.hideActionsSheet();
            }
        });
    },

    initHome: function() {
        console.log('initHome', this, arguments);
    },

    initIOEvents: function() {
        Meet.utils.Events.init();
        Meet.utils.Events.on({
            scope: this,
            visit: this.onVisiEvent,
            flash: this.onFlashEvent
        });
    },

    removeStartupScreen: function(callback) {
        var el = Ext.get('startupscreen');

        callback = callback || Ext.emptyFn;

        Ext.Anim.run(el, 'fade', {
            scope: this,
            out: true,
            autoClear: true,
            after: function() {
                el.destroy();
                callback.call(this);
                
            }
        });
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
        this.getMainPanel().setActiveItem(this.getProfilePanel());
        if (callback) {
            this.getProfilePanel().callback = callback;
        }
        if (data) {
            this.getProfilePanel().setData(data);
        }
    },

    showActivity: function() {
        console.log('showActivity', this, arguments);
        this.getMainPanel().setActiveItem(this.getActivityPanel());
    },

    showMessenger: function() {
        console.log('showMessenger', this, arguments);
        this.getMainPanel().setSlideAnimation('left');
        this.getMainPanel().setActiveItem(this.getMessengerPanel());
    },

    showActionsSheet: function() {
        var sheet = Ext.Viewport.down('meet_profile_actions');
        if (!sheet) {
            var sheet = Ext.create('Meet.view.phone.profile.Actions');
            Ext.Viewport.add(sheet);
        }
        sheet.show();
    },

    hideActionsSheet: function(callback) {
        var sheet = Ext.Viewport.down('meet_profile_actions');
        console.log('hideActionsSheet', sheet.getHideAnimation());
        sheet.hide();
        setTimeout(Ext.bind(callback, this), 300);
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

    onNotificationButtonTap: function() {
        console.log('onNotificationButtonTap', this, arguments);
    },

    onHomeMenuButtonTap: function() {
        console.log('onHomeMenuButtonTap', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.showHome();
    },

    onSearchMenuButtonTap: function() {
        console.log('onSearchMenuButtonTap', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.showSearch();
        this.getSearchPanel().getStore().load();
    },

    onProfileMenuButtonTap: function() {
        console.log('onProfileMenuButtonTap', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.showProfile(Ext.getStore('userStore').first().data, this.showHome);
    },

    onActivityMenuButtonTap: function() {
        console.log('onActivityMenuButtonTap', this, arguments);
        this.getMainPanel().setRevealAnimation('up');
        this.showActivity();
    },

    onHomePanelItemTap: function() {
        console.log('onHomePanelItemTap', this, arguments);
        var record = Ext.getStore('userStore').first();
        this.getMainPanel().setSlideAnimation('left');
        this.showProfile(record.data, this.showHome);
    },

    onSearchPanelItemTap: function(list, index) {
        var record = Ext.getStore('usersStore').getAt(index);
        console.log('onSearchPanelItemTap', record);
        this.getMainPanel().setSlideAnimation('left');
        this.showProfile(record.data, this.showSearch);
        this.visit(record.data.id);
    },

    onActivityListItemTap: function(list, index) {
        var record = list.getStore().getAt(index);
        console.log('onActivityListItemTap', record);
        this.getMainPanel().setSlideAnimation('left');
        this.showProfile(record.data, this.showActivity);
        this.visit(record.data.id);
    },

    onProfileBackButtonTap: function() {
        console.log('onProfileBackButtonTap', this, arguments);
        this.getMainPanel().setSlideAnimation('right');
        this.getProfilePanel().callback.call(this);
    },

    onProfileActionButtonTap: function() {
        this.showActionsSheet();
    },

    onProfileMessageButtonTap: function() {
        console.log('onProfileMessageButtonTap', this, arguments);
        this.hideActionsSheet(this.showMessenger);
    },

    onProfileFlashButtonTap: function() {
        console.log('onProfileFlashButtonTap', this, arguments);
        this.hideActionsSheet(this.flash);
    },

    onProfileSaveButtonTap: function() {
        console.log('onProfileSaveButtonTap', this, arguments);
        this.hideActionsSheet(this.save);
    },

    onMessengerBackButtonTap: function() {
        console.log('onMessengerBackButtonTap', this, arguments);
        this.getMainPanel().setSlideAnimation('right');
        this.showProfile();
    },

    onFlashEvent: function(data) {
        console.log('onFlashEvent', this, arguments);
        this.updateNotication();
    },

    onVisiEvent: function(data) {
        console.log('onVisiEvent', this, arguments);
        this.updateNotication();
    },

    updateNotication: function() {
        var button = this.getNotificationButton(),
            count = parseInt(button.getBadgeText() || 0) + 1;

        console.log('updateNotication', button, count);
        button.setBadgeText(''+count);
    }

});
