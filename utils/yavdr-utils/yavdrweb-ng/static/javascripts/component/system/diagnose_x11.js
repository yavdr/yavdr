YaVDR.Component.System.VDR = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-x11',
  subTitle: 'X-Server',
  initComponent: function() {
    YaVDR.Component.System.VDR.superclass.initComponent.call(this);
    this.addFileContent('X-Server Configuration (only if NVIDIA VDPAU present)', '/etc/X11/xorg.conf.yavdr');
    this.addFileContent('XSession.vdr', '/etc/X11/Xsession.vdr');
    this.addFileContent('X-Server Logfile', '/var/log/Xorg.1.log');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.VDR);