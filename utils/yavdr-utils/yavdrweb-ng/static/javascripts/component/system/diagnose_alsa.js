YaVDR.Component.System.ALSA = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-alsa',
  subTitle: 'ALSA',
  initComponent: function() {
    YaVDR.Component.System.ALSA.superclass.initComponent.call(this);
    this.addShellResponse('Alsa Device List', 'aplay');
    this.addFileContent('Alsa Custom Sound Configuration', '/etc/asound.conf');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.ALSA);