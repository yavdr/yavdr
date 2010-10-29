YaVDR.Component.System.DiagnoseSystemLogs = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-system-logs',
  subTitle: 'System Information',
  initComponent: function() {
    YaVDR.Component.System.DiagnoseSystemLogs.superclass.initComponent.call(this);
    this.addFileContent('/var/log/messages', '/var/log/messages');
    this.addFileContent('/var/log/user.log', '/var/log/user.log');
    this.addFileContent('/var/log/syslog', '/var/log/syslog');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.DiagnoseSystemLogs);
