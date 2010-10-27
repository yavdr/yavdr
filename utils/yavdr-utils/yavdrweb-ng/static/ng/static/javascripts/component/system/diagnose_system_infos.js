YaVDR.Component.System.DiagnoseSystemInfo = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-system-infos',
  subTitle: 'System-Informationen',
  initComponent: function() {
    YaVDR.Component.System.DiagnoseSystemInfo.superclass.initComponent.call(this);
    this.addShellResponse(getLL("diagnose.section.system_info.top"), 'top');
    this.addShellResponse(getLL("diagnose.section.system_info.ifconfig"), 'ifconfig');
    this.addShellResponse(getLL("diagnose.section.system_info.df"), 'df');
    this.addShellResponse(getLL("diagnose.section.system_info.dmesg"), 'dmesg');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.DiagnoseSystemInfo);