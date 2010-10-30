YaVDR.Component.System.DiagnoseSystemInfo = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-system-infos',
  subTitle: 'System Information',
  initComponent: function() {
    YaVDR.Component.System.DiagnoseSystemInfo.superclass.initComponent.call(this);
    this.addShellResponse('System Load', 'top');
    this.addShellResponse('network status', 'ifconfig');
    this.addShellResponse('Filesystem Usage', 'df');
    this.addShellResponse('Kernel Log', 'dmesg');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.DiagnoseSystemInfo);
