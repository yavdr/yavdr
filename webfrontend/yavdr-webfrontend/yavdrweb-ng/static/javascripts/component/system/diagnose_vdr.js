YaVDR.Component.System.VDR = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-vdr',
  subTitle: _('VDR basic configuration'),
  initComponent: function() {
    YaVDR.Component.System.VDR.superclass.initComponent.call(this);
    this.addFileContent(_('VDR setup.conf'), '/etc/vdr/setup.conf');
    this.addFileContent(_('VDR remote.conf'), '/etc/vdr/remote.conf');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.VDR);
