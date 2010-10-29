YaVDR.Component.System.VDR = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-vdr',
  subTitle: 'VDR-Konfiguration',
  initComponent: function() {
    YaVDR.Component.System.VDR.superclass.initComponent.call(this);
    this.addFileContent('VDR Setup', '/etc/vdr/setup.conf');
    this.addFileContent('VDR Fernbedienung', '/etc/vdr/remote.conf');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.VDR);