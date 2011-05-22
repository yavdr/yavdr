YaVDR.Component.System.VDR = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-x11',
  subTitle: _('Xorg server log'),
  initComponent: function() {
    YaVDR.Component.System.VDR.superclass.initComponent.call(this);
    this.addFileContent(_('X-Server configuration (only if NVIDIA VDPAU present)'), '/etc/X11/xorg.conf.yavdr');
    this.addFileContent(_('X-Server logfile'), '/var/log/Xorg.1.log');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.VDR);
