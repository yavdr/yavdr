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
                id: 'diagnose_panel_wrapper_'+file,
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

function getDiagnoseItems(){
    return [
        {
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
    ];
}
    