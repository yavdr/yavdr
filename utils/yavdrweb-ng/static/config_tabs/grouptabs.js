/*!
 * Ext JS Library 3.0+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.onReady(function() {
	Ext.QuickTips.init();

    var viewport = new Ext.Viewport({
        layout:'fit',
        items:[{
            xtype: 'grouptabpanel',
            tabWidth: 180,
            activeGroup: 0,
            items: [{
                //mainItem: 1,
                items: [
                    {
                        xtype: 'portal',
                        layout: 'fit',
                        title: locale.menutabs.basics.title,
                        tabTip: locale.menutabs.basics.tabtip,
                        style: 'padding: 20px 30px 20px 30px;',
                        items:[
                           new Ext.Panel({
                               layout: 'fit',
                               frame: false,
                               plain: false,
                               border: false,
                               html: '<h1 style="font-family: sans-serif;">' + locale.menutabs.basics.content + '</h1>'
                           })
                        ]
                    },
                    {
                        title: locale.lirc.menutab.title,
                        layout: 'fit',
                        iconCls: 'x-icon-tickets', //icon does not exist currently, but this property is used as a spacer
                        tabTip: locale.lirc.menutab.tabtip,
                        style: 'padding: 20px 30px 20px 30px;',
                        items: [
                            new Ext.Panel({
                                layout: 'auto',
                                title: locale.lirc.menutab.panel_title,
                                frame: true,
                                plain: false,
                                border: true,
                                items: [ getLircForm() ]
                            })
                        ]
                    },
                    {
                        title: locale.channels.menutab.title,
                        layout: 'fit',
                        iconCls: 'x-icon-tickets', //icon does not exist currently, but this property is used as a spacer
                        tabTip: locale.channels.menutab.tabtip,
                        style: 'padding: 20px 30px 20px 30px;',
                        items: [
                            new Ext.Panel({
                                layout: 'fit',
                                //title: locale.channels.menutab.panel_title,
                                frame: false,
                                plain: false,
                                border: false,
                                items: [ getChannelsForm() ]
                            })
                        ]
                    },
                    {
                        title: locale.frontend.menutab.title,
                        iconCls: 'x-icon-subscriptions',
                        tabTip: locale.frontend.menutab.tabtip,
                        style: 'padding: 20px 30px 20px 30px;',
                        layout: 'fit',
                        items: [
                            new Ext.Panel({
                                layout: 'auto',
                                title: locale.frontend.menutab.panel_title,
                                frame: true,
                                plain: false,
                                border: true,
                                items: [ getVDRFrontendForm() ]
                            })
                        ]
                    },
                    {
                        title: locale.upload.menutab.title,
                        iconCls: 'x-icon-subscriptions',
                        tabTip: locale.upload.menutab.tabtip,
                        style: 'padding: 20px 30px 20px 30px;',
                        layout: 'fit',
                        items: [
                            new Ext.Panel({
                                layout: 'fit',
                                title: locale.upload.menutab.panel_title,
                                frame: true,
                                plain: false,
                                border: true,
                                items: [ getVDRConfigUploadForm() ]
                            })
                        ]
                    },
                    {
                        title: locale.system.menutab.title,
                        iconCls: 'x-icon-subscriptions',
                        tabTip: locale.system.menutab.tabtip,
                        style: 'padding: 20px 30px 20px 30px;',
                        layout: 'fit',
                        items: [
                            new Ext.Panel({
                                layout: 'auto',
                                title: locale.system.menutab.panel_title,
                                frame: true,
                                plain: false,
                                border: true,
                                items: [ getSystemForm() ]
                            })
                        ]
                    }
                    //, {
                    //     title: locale.system.menutab.title,
                    //     iconCls: 'x-icon-subscriptions',
                    //     tabTip: locale.system.menutab.tabtip,
                    //     style: 'padding: 20px 30px 20px 30px;',
                    //     layout: 'fit',
                    //     items: [
                    //         new Ext.Panel({
                    //             layout: 'auto',
                    //             title: locale.system.menutab.panel_title,
                    //             frame: true,
                    //             plain: false,
                    //             border: true,
                    //             items: [ getNFSForm() ]
                    //         })
                    //     ]
                    // }
                ]
            }, {
                expanded: false,
                items: [getDiagnoseItems()]
            }]//grouptabpanel items
        }]//viewport items
    });//viewport
});//extonready

