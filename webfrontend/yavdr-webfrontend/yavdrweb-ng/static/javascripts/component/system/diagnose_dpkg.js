YaVDR.Component.System.Dpkg = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-dpkg',
  subTitle: _('Package information'),
  initComponent: function() {
    YaVDR.Component.System.Dpkg.superclass.initComponent.call(this);
    this.addShellResponse(_('Installed packages (VDR, VDR-Plugins, VDR-Addons, XBMC, yavdr)'), 'dpkg');
    this.addFileContent(_('Apt history of recently installed packages'), '/var/log/apt/history.log');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.Dpkg);
