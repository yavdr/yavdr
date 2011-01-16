YaVDR.Component.System.ALSA = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-alsa',
  subTitle: _('ALSA status information'),
  initComponent: function() {
    YaVDR.Component.System.ALSA.superclass.initComponent.call(this);
    this.addShellResponse(_('ALSA device list'), 'aplay');
    this.addFileContent(_('ALSA custom sound configuration'), '/etc/asound.conf');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.ALSA);
