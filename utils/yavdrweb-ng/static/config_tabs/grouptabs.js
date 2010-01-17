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
            tabWidth: 180,
            activeGroup: 0,
            items: [{
                //mainItem: 1,
                items: [
                    {
                        xtype: 'portal',
                        layout: 'fit',
                        title: 'Basics',
                        tabTip: 'Konfigurieren Sie die Grundeinstellungen wie Fernbedienung, Senderliste, etc.',
                        style: 'padding: 20px 30px 20px 30px;',
                        items:[
                           new Ext.Panel({
                               layout: 'fit',
                               frame: false,
                               plain: false,
                               border: false,
                               html: '<h1 style="font-family: sans-serif;">Willkommen im yaVDR Web-Frontend!</h1>'
                           })
                        ]
                    },
                    {
                        title: 'LIRC',
                        layout: 'fit',
                        iconCls: 'x-icon-tickets', //icon does not exist currently, but this property is used as a spacer
                        tabTip: 'Lirc-Einstellungen (Fernbedienungs-Receiver)',
                        style: 'padding: 20px 30px 20px 30px;',
                        items: [
                            new Ext.Panel({
                                layout: 'auto',
                                title: 'Fernbedienungs-Empfänger (LIRC)',
                                frame: true,
                                plain: false,
                                border: true,
                                items: [ getLircForm() ]
                            })
                        ]
                    },
                    {
                        title: 'Kanal-Liste',
                        layout: 'fit',
                        iconCls: 'x-icon-tickets', //icon does not exist currently, but this property is used as a spacer
                        tabTip: 'Kanal-Einstellungen (Radio- und Fernsehkanäle pflegen und sortieren)',
                        style: 'padding: 20px 30px 20px 30px;',
                        items: [
                            new Ext.Panel({
                                layout: 'fit',
                                //title: 'Kanal-Editor',
                                frame: false,
                                plain: false,
                                border: false,
                                items: [ getChannelsForm() ]
                            })
                        ]
                    },
                    {
                        title: 'VDR-Frontend',
                        iconCls: 'x-icon-subscriptions',
                        tabTip: 'Wechseln Sie zwischen xine und xineliboutput',
                        style: 'padding: 20px 30px 20px 30px;',
                        layout: 'fit',
                        items: [
                            new Ext.Panel({
                                layout: 'auto',
                                title: 'VDR-Frontend',
                                frame: true,
                                plain: false,
                                border: true,
                                items: [ getVDRFrontendForm() ]
                            })
                        ]
                    },
                    {
                        title: 'VDR-Konfig-Upload',
                        iconCls: 'x-icon-subscriptions',
                        tabTip: 'Laden Sie existierende VDR-Konfigurationsdateien hoch',
                        style: 'padding: 20px 30px 20px 30px;',
                        layout: 'fit',
                        items: [
                            new Ext.Panel({
                                layout: 'fit',
                                title: 'VDR-Konfig-Upload (der Upload überschreibt die bestehende Datei-Version)',
                                frame: true,
                                plain: false,
                                border: true,
                                items: [ getVDRConfigUploadForm() ]
                            })
                        ]
                    },
                    {
                        title: 'System',
                        iconCls: 'x-icon-subscriptions',
                        tabTip: 'Starten Sie den Rechner via Web-Frontend neu',
                        style: 'padding: 20px 30px 20px 30px;',
                        layout: 'fit',
                        items: [
                            new Ext.Panel({
                                layout: 'auto',
                                title: 'System-Kommandos',
                                frame: true,
                                plain: false,
                                border: true,
                                items: [ getSystemForm() ]
                            })
                        ]
                    }
                ]
            }, {
                expanded: false,
                items: [getDiagnoseItems()]
            }]//grouptabpanel items
        }]//viewport items
    });//viewport
});//extonready

