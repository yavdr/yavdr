YaVDR.Component.System.XBMC = Ext.extend(YaVDR.Component.System.Diagnose, {
  itemId: 'system-diagnose-xbmc',
  subTitle: 'XBMC-Abstürze',
  initComponent: function() {
    YaVDR.Component.System.XBMC.superclass.initComponent.call(this);
    this.addFileContent('/var/lib/vdr/.xbmc/temp/xbmc.log', '/var/lib/vdr/.xbmc/temp/xbmc.log');
    this.addFileContent('/var/lib/vdr/.xbmc/temp/xbmc.old.log', '/var/lib/vdr/.xbmc/temp/xbmc.old.log');
  }
});
YaVDR.registerComponent(YaVDR.Component.System.XBMC);