/*!
 * Ext JS Library 3.0+
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.onReady(function() {
	Ext.QuickTips.init();
    
    // create some portlet tools using built in Ext tool ids
    var tools = [{
        id:'gear',
        handler: function(){
            Ext.Msg.alert('Message', 'The Settings tool was clicked.');
        }
    },{
        id:'close',
        handler: function(e, target, panel){
            panel.ownerCt.remove(panel, true);
        }
    }];

    var viewport = new Ext.Viewport({
        layout:'fit',
        items:[{
            xtype: 'grouptabpanel',
            tabWidth: 130,
            activeGroup: 0,
            items: [{
                //mainItem: 1,
                items: [
                    {
                        xtype: 'portal',
                        layout: 'fit',
                        title: 'Basics',
                        tabTip: 'Konfigurieren Sie die Grundeinstellungen wie Fernbedienung, X11, etc.',
                        style: 'padding: 10px 30px 10px 30px;',
                        items:[
                           new Ext.Panel({
                               layout: 'fit',
                               frame: true,
                               plain: false,
                               border: false,
                               html: 'Willkommen im yaVDR Web Front End!'
                           })
                        ]
                    },
                    {
                        title: 'LIRC',
                        layout: 'fit',
                        iconCls: 'x-icon-tickets',
                        tabTip: 'Lirc-Einstellungen (Fernbedienungs-Receiver)',
                        style: 'padding: 10px 30px 10px 30px;',
                        items: [
                            new Ext.Panel({
                                layout: 'fit',
                                title: 'Fernbedienungs-Empfänger (LIRC)',
                                frame: false,
                                plain: false,
                                border: false,
                                items: [ getLircForm( lircData ) ]
                            })
                        ]
                    },
                    {
                        title: 'X11',
                        iconCls: 'x-icon-subscriptions',
                        tabTip: 'X11 tabtip',
                        style: 'padding: 10px 30px 10px 30px;',
                        layout: 'fit',
                        items: [
                            new Ext.Panel({
                                layout: 'fit',
                                title: 'Bildschirmausgabe',
                                frame: false,
                                plain: false,
                                border: false,
                                items: [ getX11Form( resolutionArray ) ]
                            })
                        ]    
                    },
                    {
                        title: 'Dummy',
                        iconCls: 'x-icon-users',
                        tabTip: 'Dummy tabtip',
                        style: 'padding: 10px;',
                        html: 'Testing... 1',
                        frame: true
                    }
                ]
            }, {
                expanded: true,
                items: [{
                    title: 'Plugins',
                    iconCls: 'x-icon-configuration',
                    tabTip: 'Plugin tabtip',
                    style: 'padding: 10px;',
                    frame: false,
                    border: false,
                    html: 'Testing... 2' 
                }, {
                    title: 'streamdev-server',
                    iconCls: 'x-icon-templates',
                    tabTip: 'streamdev-server tabtip',
                    style: 'padding: 40px;',
                    html: 'Testing... 3'
                }]
            }]
        }]
    });
});
