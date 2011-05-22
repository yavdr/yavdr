YaVDR.Component.System.DiagnoseSystemInfo = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-system-infos',
  subTitle: _('System information'),
  initComponent: function() {
    YaVDR.Component.System.DiagnoseSystemInfo.superclass.initComponent.call(this);
    this.addShellResponse(_('System load'), 'top');
    this.addShellResponse(_('Network status'), 'ifconfig');
    this.addShellResponse(_('Filesystem usage'), 'df');
    this.addShellResponse(_('Kernel log'), 'dmesg');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.DiagnoseSystemInfo);
