function addDiagnosePanel(info, cmd, file)
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
            text: locale.diagnose.toolbar.button.refresh,
            icon: 'ext/resources/images/default/grid/refresh.gif',
            tooltip: locale.diagnose.toolbar.button.refresh_tooltip,
            handler: function(){
                var thisObj = Ext.getCmp('diagnose_panel_'+file).getUpdater();
                if(thisObj) thisObj.refresh();
            }
        },'-',{
            text: locale.diagnose.toolbar.button.jumpdown,
            icon: 'ext/resources/images/default/layout/ns-expand.gif',
            tooltip: locale.diagnose.toolbar.button.jumpdown_tooltip,
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

function addDiagnoseMenuItem( title, tabTip, tabs){
    return [{
        title: title,
        layout: 'fit',
        iconCls: 'x-icon-configuration', //needed for left padding even if we don't use an icon...
        tabTip: tabTip,
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
                items: tabs 
            })
        ]
    }];
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
            html: '<p style="font-family: sans-serif;">' + locale.diagnose.module_description + '</p>'
        },
        addDiagnoseMenuItem(
            locale.diagnose.section.system_info.title,
            locale.diagnose.section.system_info.description,
            [
                addDiagnosePanel('Netzwerkstatus', 'get_shell_response', 'ifconfig'),
                addDiagnosePanel('Systemstatus', 'get_shell_response', 'top'),
                addDiagnosePanel('Kernel', 'get_shell_response', 'dmesg'),
                addDiagnosePanel('Dateisystem-Belegung', 'get_shell_response', 'df')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.system_logs.title,
            locale.diagnose.section.system_logs.description,
            [
                addDiagnosePanel('Logfile messages','get_file_content', '/var/log/messages'),
                addDiagnosePanel('Logfile user.log','get_file_content', '/var/log/user.log'),
                addDiagnosePanel('Logfile syslog','get_file_content', '/var/log/syslog')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.xbmc.title,
            locale.diagnose.section.xbmc.description,
            [
                addDiagnosePanel('XBMC Logfile','get_file_content', '/var/lib/vdr/.xbmc/temp/xbmc.log'),
                addDiagnosePanel('XBMC Logfile (old)','get_file_content', '/var/lib/vdr/.xbmc/temp/xbmc.old.log')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.lirc.title,
            locale.diagnose.section.lirc.description,
            [
                addDiagnosePanel('LIRC Hardware-Konfiguration','get_file_content', '/etc/lirc/hardware.conf'),
                addDiagnosePanel('LIRC lircd-Konfiguration', 'get_file_content', '/etc/lirc/lircd.conf')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.vdr.title,
            locale.diagnose.section.vdr.description,
            [
                addDiagnosePanel('VDR Setup', 'get_file_content', '/etc/vdr/setup.conf'),
                addDiagnosePanel('VDR Fernbedienung','get_file_content', '/etc/vdr/remote.conf'),
                addDiagnosePanel('VDR Installierte Plugins + Addons', 'get_shell_response', 'dpkg')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.xorg.title,
            locale.diagnose.section.xorg.description,
            [
                addDiagnosePanel('X-Server Konfiguration','get_file_content', '/etc/X11/xorg.conf.yavdr')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.sound.title,
            locale.diagnose.section.sound.description,
            [
                addDiagnosePanel('Alsa-Sound', 'get_shell_response', 'aplay'),
                addDiagnosePanel('Sound (ALSA)','get_file_content', '/etc/asound.conf')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.yavdr.title,
            locale.diagnose.section.yavdr.description,
            [
                addDiagnosePanel('yaVDR Datenbank', 'get_file_content', '/var/lib/yavdrdb.hdf'),
                addDiagnosePanel('Webserver-Logfile (tntnet)','get_file_content', '/var/log/tntnet/tntnet.log')
            ]
        )
    ];
}