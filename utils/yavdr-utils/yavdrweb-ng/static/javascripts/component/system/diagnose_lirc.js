YaVDR.Component.System.LIRC = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-lirc',
  subTitle: 'LIRC-Konfiguration',
  initComponent: function() {
    YaVDR.Component.System.LIRC.superclass.initComponent.call(this);
    this.addFileContent('LIRC Hardware Configuration', '/etc/lirc/hardware.conf');
    this.addFileContent('LIRCD Configuration', '/etc/lirc/lircd.conf');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.LIRC);