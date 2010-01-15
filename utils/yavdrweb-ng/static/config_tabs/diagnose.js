function yaVDRLogFilePanel(info, cmd, file)
{ 
    return new Ext.Panel({
        id: 'diagnose_panel_wrapper_'+file,
        title: info + ' (' + file + ')',
        frame: true,
        border: true,
        //bodyBorder: true,
        bodyStyle: 'border: 1px solid lightgrey; background-color: white; padding: 2px;',
        autoScroll: true,
        tbar: [{
            text: 'Aktualisieren',
            icon: 'ext/resources/images/default/grid/refresh.gif',
            tooltip: 'Klicken Sie diesen Button, um den Inhalt des Panels zu aktualisieren.',
            handler: function(){
                var thisObj = Ext.getCmp('diagnose_panel_'+file).getUpdater();
                if(thisObj) thisObj.refresh();
            }
        },'-',{
            text: 'Ans Ende springen',
            icon: 'ext/resources/images/default/layout/ns-expand.gif',
            tooltip: 'Klicken Sie diesen Button, um an das Endes des Inhalts dieses Panels zu springen.',
            handler: function(){
                var d = Ext.getCmp('diagnose_panel_wrapper_'+file).body.dom;
                d.scrollTop = d.scrollHeight - d.offsetHeight;
            }
        }],
        items: [
            new Ext.Panel({
                id: 'diagnose_panel_'+file,
                layout: 'fit',
                frame: false,
                border: false,
                style: 'font-family: monospace; white-space: pre; font-size: 12px;',
                autoLoad: cmd + '?' + (cmd === 'get_file_content' ? 'file' : 'command') + '=' + file
            })
        ]
    });
}

function getDiagnoseItems(){
    return [
        {
            title: 'Diagnose',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'Diagnose tabtip',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            html: '<p style="font-family: sans-serif;">Inhalte von wichtigen Logfiles und Konfigurationsdateien</p>'
        },
        {
            title: 'System-Informationen',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'Netzwerk-Status, Auslastung und Prozesse',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            items: [
                new Ext.TabPanel({
                    frame: false,
                    border: false,
                    plain: true,
                    activeTab: 0,
                    defaults:{autoScroll: true},
                    items: [
                            yaVDRLogFilePanel('Netzwerkstatus', 'get_shell_response', 'ifconfig'),
                            yaVDRLogFilePanel('Systemstatus', 'get_shell_response', 'top'),
                            yaVDRLogFilePanel('Speicherplatz', 'get_shell_response', 'df'),
                            yaVDRLogFilePanel('Alsa-Sound', 'get_shell_response', 'aplay')
                    ]
                })
            ]
        },
        {
            title: 'System-Logfiles',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'Wichtige System-Logfiles',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            items: [
                new Ext.TabPanel({
                    frame: false,
                    border: false,
                    plain: true,
                    activeTab: 0,
                    defaults:{autoScroll: true},
                    items: [
                            yaVDRLogFilePanel('Logfile messages','get_file_content', '/var/log/messages'),
                            yaVDRLogFilePanel('Logfile user.log','get_file_content', '/var/log/user.log'),
                            yaVDRLogFilePanel('Logfile syslog','get_file_content', '/var/log/syslog')
                    ]
                })
            ]
        },
        {
            title: 'XBMC-Crashes',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'XBMC Logfiles',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            items: [
                new Ext.TabPanel({
                    frame: false,
                    border: false,
                    plain: true,
                    activeTab: 0,
                    defaults:{autoScroll: true},
                    items: [
                        yaVDRLogFilePanel('XBMC-Logfile','get_file_content', '/var/lib/vdr/.xbmc/temp/xbmc.log'),
                        yaVDRLogFilePanel('XBMC-Logfile (old)','get_file_content', '/var/lib/vdr/.xbmc/temp/xbmc.old.log')
                    ]
                })
            ]
        },
        {
            title: 'LIRC-Konfiguration',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'LIRC-Problemdiagnose',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            items: [
                new Ext.TabPanel({
                    frame: false,
                    border: false,
                    plain: true,
                    activeTab: 0,
                    defaults:{autoScroll: true},
                    items: [
                        yaVDRLogFilePanel('LIRC: Hardware-Konfiguration','get_file_content', '/etc/lirc/hardware.conf'),
                        yaVDRLogFilePanel('LIRC: lircd-Konfiguration', 'get_file_content', '/etc/lirc/lircd.conf')
                    ]
                })
            ]
        },
        {
            title: 'VDR-Konfiguration',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'VDR-Konfiguration',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            items: [
                new Ext.TabPanel({
                    frame: false,
                    border: false,
                    plain: true,
                    activeTab: 0,
                    defaults:{autoScroll: true},
                    items: [
                        yaVDRLogFilePanel('VDR: Setup', 'get_file_content', '/etc/vdr/setup.conf'),
                        yaVDRLogFilePanel('VDR: Fernbedienung','get_file_content', '/etc/vdr/remote.conf')
                    ]
                })
            ]
        },
        {
            title: 'X-Server',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'LIRC-Problemdiagnose',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            items: [
                new Ext.TabPanel({
                    frame: false,
                    border: false,
                    plain: true,
                    activeTab: 0,
                    defaults:{autoScroll: true},
                    items: [
                        yaVDRLogFilePanel('X-Server Konfiguration','get_file_content', '/etc/X11/xorg.conf.yavdr')
                    ]
                })
            ]
        },
        {
            title: 'Sound (ALSA)',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'Digitalsound-Problemdiagnose',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            items: [
                new Ext.TabPanel({
                    frame: false,
                    border: false,
                    plain: true,
                    activeTab: 0,
                    defaults:{autoScroll: true},
                    items: [
                        yaVDRLogFilePanel('Sound (ALSA)','get_file_content', '/etc/asound.conf')
                    ]
                })
            ]
        },
        {
            title: 'yaVDR-Utils',
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: 'yaVDR-Utils Diagnose (Datenbank + Web-Server)',
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            items: [
                new Ext.TabPanel({
                    frame: false,
                    border: false,
                    plain: true,
                    activeTab: 0,
                    defaults:{autoScroll: true},
                    items: [
                        yaVDRLogFilePanel('yaVDR Datenbank', 'get_file_content', '/var/lib/yavdrdb.hdf'),
                        yaVDRLogFilePanel('Webserver-Logfile (tntnet)','get_file_content', '/var/log/tntnet/tntnet.log')
                    ]
                })
            ]
        }
    ];
}