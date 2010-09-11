function addDiagnosePanel(info, cmd, file){ 
    return new Ext.Panel({
        id: 'diagnose_panel_wrapper_'+file,
        title: info + ' (' + file + ')',
        frame: true,
        border: true,
        //bodyBorder: true,
        bodyStyle: 'border: 1px solid lightgrey; background-color: white; padding: 2px;',
        autoScroll: true,
        tbar: [{
            text: getLL("diagnose.toolbar.button.refresh"),
            icon: '/ext/resources/images/default/grid/refresh.gif',
            tooltip: getLL("diagnose.toolbar.button.refresh_tooltip"),
            handler: function(){
                var thisObj = Ext.getCmp('diagnose_panel_'+file).getUpdater();
                if(thisObj) thisObj.refresh();
            }
        },'-',{
            text: getLL("diagnose.toolbar.button.jumpdown"),
            icon: '/ext/resources/images/default/layout/ns-expand.gif',
            tooltip: getLL("diagnose.toolbar.button.jumpdown_tooltip"),
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

function addDiagnosePanelShellResponse(info, file){
    return addDiagnosePanel(info, 'get_shell_response', file);
}

function addDiagnosePanelFileContent(info, file){
    return addDiagnosePanel(info, 'get_file_content', file);
}

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "diagnose"})
             .addGroupPanelTab({
                    section: "system_info",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelShellResponse( getLL("diagnose.section.system_info.top"),      'top'),
                        addDiagnosePanelShellResponse( getLL("diagnose.section.system_info.ifconfig"), 'ifconfig'),
                        addDiagnosePanelShellResponse( getLL("diagnose.section.system_info.df"),       'df'),
                        addDiagnosePanelShellResponse( getLL("diagnose.section.system_info.dmesg"),    'dmesg')
                    ]})
             .addGroupPanelTab({
                    section: "system_logs",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelFileContent('Logfile', '/var/log/messages'),
                        addDiagnosePanelFileContent('Logfile', '/var/log/user.log'),
                        addDiagnosePanelFileContent('Logfile', '/var/log/syslog')
                    ]})
             .addGroupPanelTab({
                    section: "xbmc",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelFileContent('XBMC Logfile', '/var/lib/vdr/.xbmc/temp/xbmc.log'),
                        addDiagnosePanelFileContent('XBMC Logfile (old)', '/var/lib/vdr/.xbmc/temp/xbmc.old.log')
                    ]})
             .addGroupPanelTab({
                    section: "lirc",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelFileContent('LIRC Hardware Configuration', '/etc/lirc/hardware.conf'),
                        addDiagnosePanelFileContent('LIRCD Configuration', '/etc/lirc/lircd.conf')
                    ]})
             .addGroupPanelTab({
                    section: "vdr",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelFileContent('VDR Setup', '/etc/vdr/setup.conf'),
                        addDiagnosePanelFileContent('VDR Fernbedienung', '/etc/vdr/remote.conf')
                    ]})
             .addGroupPanelTab({
                    section: "xorg",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelFileContent('X-Server Configuration (only if NVIDIA VDPAU present)', '/etc/X11/xorg.conf.yavdr'),
                        addDiagnosePanelFileContent('XSession.vdr', '/etc/X11/Xsession.vdr'),
                        addDiagnosePanelFileContent('X-Server Logfile', '/var/log/Xorg.1.log')
                    ]})
             .addGroupPanelTab({
                    section: "sound",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelShellResponse('Alsa Device List', 'aplay'),
                        addDiagnosePanelFileContent('Alsa Custom Sound Configuration', '/etc/asound.conf')
                    ]})
             .addGroupPanelTab({
                    section: "packages",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelShellResponse('Installed packages (VDR, VDR-Plugins, VDR-Addons, XBMC, yavdr)', 'dpkg'),
                        addDiagnosePanelFileContent('Apt history of recently installed packages', '/var/log/apt/history.log')
                    ]})
             .addGroupPanelTab({
                    section: "yavdr",
                    locale_prefix: 'diagnose.section',
                    items:   [
                        addDiagnosePanelFileContent('yaVDR DB', '/var/lib/yavdrdb.hdf'),
                        addDiagnosePanelFileContent('Logfile Webserver', '/var/log/tntnet/tntnet.log')
                    ]});
});