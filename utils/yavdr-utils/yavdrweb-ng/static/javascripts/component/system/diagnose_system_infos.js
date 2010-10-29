YaVDR.Component.System.DiagnoseSystemInfo = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-system-infos',
  subTitle: 'System Information',
  initComponent: function() {
    YaVDR.Component.System.DiagnoseSystemInfo.superclass.initComponent.call(this);
    this.addShellResponse('Systemauslastung', 'top');
    this.addShellResponse('Netzwerkstatus', 'ifconfig');
    this.addShellResponse('Dateisystem-Belegung', 'df');
    this.addShellResponse('Kernel', 'dmesg');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.DiagnoseSystemInfo);
