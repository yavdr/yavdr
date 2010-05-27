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
            icon: 'ext/resources/images/default/grid/refresh.gif',
            tooltip: getLL("diagnose.toolbar.button.refresh_tooltip"),
            handler: function(){
                var thisObj = Ext.getCmp('diagnose_panel_'+file).getUpdater();
                if(thisObj) thisObj.refresh();
            }
        },'-',{
            text: getLL("diagnose.toolbar.button.jumpdown"),
            icon: 'ext/resources/images/default/layout/ns-expand.gif',
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
            title: getLL("menutabs.diagnose.title"),
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: getLL("menutabs.diagnose.tabtip"),
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            html: '<p style="font-family: sans-serif;">' + getLL("menutabs.diagnose.content") + '</p>'
        },
        addDiagnoseMenuItem(
            getLL("diagnose.section.system_info.title"),
            getLL("diagnose.section.system_info.description"),
            [
                addDiagnosePanelShellResponse( getLL("diagnose.section.system_info.top"),      'top'),
                addDiagnosePanelShellResponse( getLL("diagnose.section.system_info.ifconfig"), 'ifconfig'),
                addDiagnosePanelShellResponse( getLL("diagnose.section.system_info.df"),       'df'),
                addDiagnosePanelShellResponse( getLL("diagnose.section.system_info.dmesg"),    'dmesg')
            ]
        ),
        addDiagnoseMenuItem(
            getLL("diagnose.section.system_logs.title"),
            getLL("diagnose.section.system_logs.description"),
            [
                addDiagnosePanelFileContent('Logfile', '/var/log/messages'),
                addDiagnosePanelFileContent('Logfile', '/var/log/user.log'),
                addDiagnosePanelFileContent('Logfile', '/var/log/syslog')
            ]
        ),
        addDiagnoseMenuItem(
            getLL("diagnose.section.xbmc.title"),
            getLL("diagnose.section.xbmc.description"),
            [
                addDiagnosePanelFileContent('XBMC Logfile', '/var/lib/vdr/.xbmc/temp/xbmc.log'),
                addDiagnosePanelFileContent('XBMC Logfile (old)', '/var/lib/vdr/.xbmc/temp/xbmc.old.log')
            ]
        ),
        addDiagnoseMenuItem(
            getLL("diagnose.section.lirc.title"),
            getLL("diagnose.section.lirc.description"),
            [
                addDiagnosePanelFileContent('LIRC Hardware Configuration', '/etc/lirc/hardware.conf'),
                addDiagnosePanelFileContent('LIRCD Configuration', '/etc/lirc/lircd.conf')
            ]
        ),
        addDiagnoseMenuItem(
            getLL("diagnose.section.vdr.title"),
            getLL("diagnose.section.vdr.description"),
            [
                addDiagnosePanelFileContent('VDR Setup', '/etc/vdr/setup.conf'),
                addDiagnosePanelFileContent('VDR Fernbedienung', '/etc/vdr/remote.conf')
            ]
        ),
        addDiagnoseMenuItem(
            getLL("diagnose.section.xorg.title"),
            getLL("diagnose.section.xorg.description"),
            [
                addDiagnosePanelFileContent('X-Server Configuration (only if NVIDIA VDPAU present)', '/etc/X11/xorg.conf.yavdr'),
                addDiagnosePanelFileContent('XSession.vdr', '/etc/X11/Xsession.vdr'),
                addDiagnosePanelFileContent('X-Server Logfile', '/var/log/Xorg.1.log')
            ]
        ),
        addDiagnoseMenuItem(
            getLL("diagnose.section.sound.title"),
            getLL("diagnose.section.sound.description"),
            [
                addDiagnosePanelShellResponse('Alsa Device List', 'aplay'),
                addDiagnosePanelFileContent('Alsa Custom Sound Configuration', '/etc/asound.conf')
            ]
        ),
        addDiagnoseMenuItem(
            getLL("diagnose.section.packages.title"),
            getLL("diagnose.section.packages.description"),
            [
                addDiagnosePanelShellResponse('Installierte Packages (VDR, VDR-Plugins, VDR-Addons, XBMC, yavdr)', 'dpkg')
            ]
        ),
        addDiagnoseMenuItem(
            getLL("diagnose.section.yavdr.title"),
            getLL("diagnose.section.yavdr.description"),
            [
                addDiagnosePanelFileContent('yaVDR DB', '/var/lib/yavdrdb.hdf'),
                addDiagnosePanelFileContent('Logfile Webserver', '/var/log/tntnet/tntnet.log')
            ]
        )
    ];
}