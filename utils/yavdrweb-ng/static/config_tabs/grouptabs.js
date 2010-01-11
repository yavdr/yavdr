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
            tabWidth: 200,
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
                               html: '<h1 style="font-family: sans-serif;">Willkommen im yaVDR Web Front End!</h1>'+
                                   '<br/><p  style="font-family: sans-serif;">Hier geht\'s zum <a href="static/tests/file_upload_test.html" target="_blank">File Upload Test</a>.</p>'
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
                        title: 'Kanal-Editor',
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
                    }
                    /*obsolete, only demo ,
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
                    },*//*
                    {
                        title: 'Dummy',
                        iconCls: 'x-icon-users',
                        tabTip: 'Dummy tabtip',
                        style: 'padding: 10px;',
                        html: 'Testing... 1',
                        frame: true
                    }*/
                ]
            }, {
                expanded: false,
                items: [getDiagnoseItems()]
            }]//grouptabpanel items
        }]//viewport items
    });//viewport
});//extonready

