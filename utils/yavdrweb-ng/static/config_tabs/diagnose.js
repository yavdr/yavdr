function yaVDRLogFilePanel(info, cmd, file)
{ 
    return {
        title: info,
        iconCls: 'x-icon-templates',
        tabTip: 'logfile tabtip' + file,
        style: 'padding: 20px 30px 20px 30px;',
        layout:'fit',
        items: [
            new Ext.Panel({
                id: 'diagnose_panel_wrapper_'+file,
                title: info + ' (' + file + ')',
                frame: true,
                border: true,
                //bodyBorder: true,
                bodyStyle: 'border: 1px solid lightgray; background-color: white; padding: 2px;',
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
                        autoLoad: cmd + '?' + (cmd === 'get_file_content' ? 'file' : 'command') + '='+file
                    })
                ]
            })
        ]
    };
}

function getDiagnoseItems(){
    return [
        {
            title: 'Diagnose',
            iconCls: 'x-icon-configuration',
            tabTip: 'Logfiles tabtip',
            style: 'padding: 10px;',
            frame: false,
            border: false,
            html: '<p style="font-family: sans-serif;">Inhalte von wichtigen Logfiles und Konfigurationsdateien</p>' 
        },
        yaVDRLogFilePanel('Netzwerkstatus', 'get_shell_response', 'ifconfig'),
        yaVDRLogFilePanel('Systemstatus (top)', 'get_shell_response', 'top'),
        yaVDRLogFilePanel('VDR: Setup', 'get_file_content', '/etc/vdr/setup.conf'),
        yaVDRLogFilePanel('VDR: Fernbedienung','get_file_content', '/etc/vdr/remote.conf'),
        yaVDRLogFilePanel('LIRC: Hardware-Konfiguration','get_file_content', '/etc/lirc/hardware.conf'),
        yaVDRLogFilePanel('LIRC: lircd-Konfiguration', 'get_file_content', '/etc/lirc/lircd.conf'),
        yaVDRLogFilePanel('X-Server Konfiguration','get_file_content', '/etc/X11/xorg.conf.yavdr'),
        yaVDRLogFilePanel('XBMC-Logfile','get_file_content', '/home/'+ user + '/.xbmc/temp/xbmc.log'),
        yaVDRLogFilePanel('XBMC-Logfile (old)','get_file_content', '/home/'+ user + '/.xbmc/temp/xbmc.old.log'),
        yaVDRLogFilePanel('System-Logfile: messages','get_file_content', '/var/log/messages'),
        yaVDRLogFilePanel('System-Logfile: user.log','get_file_content', '/var/log/user.log'),
        yaVDRLogFilePanel('System-Logfile: syslog','get_file_content', '/var/log/syslog'),
        yaVDRLogFilePanel('Webserver-Logfile (tntnet)','get_file_content', '/var/log/tntnet/tntnet.log'),
        yaVDRLogFilePanel('yaVDR Datenbank', 'get_file_content', '/var/lib/yavdrdb.hdf')
    ];
}
    