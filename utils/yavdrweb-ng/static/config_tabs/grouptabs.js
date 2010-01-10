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

    function yaVDRLogFilePanel(file)
    { 
        return {
            title: file,
            iconCls: 'x-icon-templates',
            tabTip: 'logfile tabtip' + file,
            style: 'padding: 20px 30px 20px 30px;',
            layout:'fit',
            items: [
                new Ext.Panel({
                    title: file,
                    frame: false,
                    border: true,
                    autoScroll: true,
                    tbar: [{
                        text: 'Aktualisieren',
                        icon: 'ext/resources/images/default/grid/refresh.gif',
                        tooltip: 'Klicken Sie diesen Button, um den Inhalt des Panels zu aktualisieren.',
                        handler: function(){
                            var thisObj = Ext.getCmp('diagnose_panel_'+file).getUpdater();
                            if(thisObj) thisObj.refresh();
                            //Ext.Msg.alert('Message', 'The button was clicked.');
                        }
                        //iconCls: 'add16'
                    }],
                    items: [
                        new Ext.Panel({
                            id: 'diagnose_panel_'+file,
                            frame: false,
                            border: false,
                            style: 'font-family: monospace; white-space: pre; font-size: 12px;',
                            autoLoad: 'get_file_content?file='+file
                        })
                    ]
                })
            ]
        };
    }

    
    
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
                        tabTip: 'Konfigurieren Sie die Grundeinstellungen wie Fernbedienung, X11, etc.',
                        style: 'padding: 10px 30px 10px 30px;',
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
                                border: true,
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
                expanded: true,
                items: [{
                    title: 'Diagnose',
                    iconCls: 'x-icon-configuration',
                    tabTip: 'Logfiles tabtip',
                    style: 'padding: 10px;',
                    frame: false,
                    border: false,
                    html: 'Inhalte von wichtigen Logfiles und Konfigurationsdateien' 
                    },
                    yaVDRLogFilePanel('/var/lib/yavdrdb.hdf'),
                    yaVDRLogFilePanel('/etc/X11/xorg.conf.yavdr'),
                    yaVDRLogFilePanel('/etc/lirc/hardware.conf'),
                    yaVDRLogFilePanel('/etc/lirc/lircd.conf'),
                    yaVDRLogFilePanel('/etc/vdr/setup.conf'),
                    yaVDRLogFilePanel('/etc/vdr/remote.conf'),
                    yaVDRLogFilePanel('/var/log/messages'),
                    yaVDRLogFilePanel('/var/log/user.log'),
                    yaVDRLogFilePanel('/var/log/syslog'),
                    yaVDRLogFilePanel('/var/log/tntnet/tntnet.log')
                ]
            }]//grouptabpanel items
        }]//viewport items
    });//viewport
});//extonready

