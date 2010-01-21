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
            title: locale.menutabs.diagnose.title,
            layout: 'fit',
            iconCls: 'x-icon-configuration',
            tabTip: locale.menutabs.diagnose.tabtip,
            style: 'padding: 20px 30px 20px 30px;',
            frame: false,
            border: false,
            html: '<p style="font-family: sans-serif;">' + locale.menutabs.diagnose.content + '</p>'
        },
        addDiagnoseMenuItem(
            locale.diagnose.section.system_info.title,
            locale.diagnose.section.system_info.description,
            [
                addDiagnosePanelShellResponse( locale.diagnose.section.system_info.ifconfig, 'ifconfig'),
                addDiagnosePanelShellResponse( locale.diagnose.section.system_info.top,      'top'),
                addDiagnosePanelShellResponse( locale.diagnose.section.system_info.dmesg,    'dmesg'),
                addDiagnosePanelShellResponse( locale.diagnose.section.system_info.df,       'df')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.system_logs.title,
            locale.diagnose.section.system_logs.description,
            [
                addDiagnosePanelFileContent('Logfile', '/var/log/messages'),
                addDiagnosePanelFileContent('Logfile', '/var/log/user.log'),
                addDiagnosePanelFileContent('Logfile',   '/var/log/syslog')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.xbmc.title,
            locale.diagnose.section.xbmc.description,
            [
                addDiagnosePanelFileContent('XBMC Logfile', '/var/lib/vdr/.xbmc/temp/xbmc.log'),
                addDiagnosePanelFileContent('XBMC Logfile (old)', '/var/lib/vdr/.xbmc/temp/xbmc.old.log')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.lirc.title,
            locale.diagnose.section.lirc.description,
            [
                addDiagnosePanelFileContent('LIRC Hardware Configuration', '/etc/lirc/hardware.conf'),
                addDiagnosePanelFileContent('LIRCD Configuration', '/etc/lirc/lircd.conf')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.vdr.title,
            locale.diagnose.section.vdr.description,
            [
                addDiagnosePanelFileContent('VDR Setup', '/etc/vdr/setup.conf'),
                addDiagnosePanelFileContent('VDR Fernbedienung', '/etc/vdr/remote.conf'),
                addDiagnosePanelShellResponse('Installierte VDR-Pakete, VDR-Plugins, VDR-Addons', 'dpkg')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.xorg.title,
            locale.diagnose.section.xorg.description,
            [
                addDiagnosePanelFileContent('X-Server Konfiguration', '/etc/X11/xorg.conf.yavdr')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.sound.title,
            locale.diagnose.section.sound.description,
            [
                addDiagnosePanelShellResponse('Alsa Device List', 'aplay'),
                addDiagnosePanelFileContent('Alsa Custom Sound Configuration', '/etc/asound.conf')
            ]
        ),
        addDiagnoseMenuItem(
            locale.diagnose.section.yavdr.title,
            locale.diagnose.section.yavdr.description,
            [
                addDiagnosePanelFileContent('yaVDR DB', '/var/lib/yavdrdb.hdf'),
                addDiagnosePanelFileContent('Logfile Webserver', '/var/log/tntnet/tntnet.log')
            ]
        )
    ];
}