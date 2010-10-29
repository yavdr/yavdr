YaVDR.Component.System.Dpkg = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-dpkg',
  subTitle: 'Package information',
  initComponent: function() {
    YaVDR.Component.System.Dpkg.superclass.initComponent.call(this);
    this.addShellResponse('Installed packages (VDR, VDR-Plugins, VDR-Addons, XBMC, yavdr)', 'dpkg');
    this.addFileContent('Apt history of recently installed packages', '/var/log/apt/history.log');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.Dpkg);
