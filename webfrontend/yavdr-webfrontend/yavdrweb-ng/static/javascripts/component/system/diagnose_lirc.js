YaVDR.Component.System.LIRC = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-lirc',
  subTitle: _('LIRC configuration'),
  initComponent: function() {
    YaVDR.Component.System.LIRC.superclass.initComponent.call(this);
    this.addFileContent(_('LIRC hardware configuration'), '/etc/lirc/hardware.conf');
    this.addFileContent(_('LIRCD configuration'), '/etc/lirc/lircd.conf');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.LIRC);
