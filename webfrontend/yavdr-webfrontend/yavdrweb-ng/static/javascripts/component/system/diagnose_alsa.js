YaVDR.Component.System.ALSA = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-alsa',
  subTitle: _('ALSA status information'),
  initComponent: function() {
    YaVDR.Component.System.ALSA.superclass.initComponent.call(this);
    this.addShellResponse(_('Alsa Device List'), 'aplay');
    this.addFileContent(_('Alsa Custom Sound Configuration'), '/etc/asound.conf');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.ALSA);
