YaVDR.Component.System.YaVDR = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-yavdr',
  subTitle: 'YaVDR database',
  initComponent: function() {
    YaVDR.Component.System.YaVDR.superclass.initComponent.call(this);
    this.addFileContent('yaVDR DB', '/var/lib/yavdrdb.hdf');
    this.addFileContent('Logfile Webserver', '/var/log/tntnet/tntnet.log');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.YaVDR);
