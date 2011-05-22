YaVDR.Component.System.YaVDR = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-yavdr',
  subTitle: _('yaVDR database'),
  initComponent: function() {
    YaVDR.Component.System.YaVDR.superclass.initComponent.call(this);
    this.addFileContent(_('yaVDR DB'), '/var/lib/yavdrdb.hdf');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.YaVDR);
