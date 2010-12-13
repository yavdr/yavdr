YaVDR.Component.System.DiagnoseSystemInfo = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-system-infos',
  subTitle: _('System Information'),
  initComponent: function() {
    YaVDR.Component.System.DiagnoseSystemInfo.superclass.initComponent.call(this);
    this.addShellResponse(_('System Load'), 'top');
    this.addShellResponse(_('Network Status'), 'ifconfig');
    this.addShellResponse(_('Filesystem Usage'), 'df');
    this.addShellResponse(_('Kernel Log'), 'dmesg');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.DiagnoseSystemInfo);
