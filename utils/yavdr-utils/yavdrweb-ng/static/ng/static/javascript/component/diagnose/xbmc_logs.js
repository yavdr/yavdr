YaVDR.Component.Diagnose.XbmcLogs = Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-xbmc-logs',
  title: 'XBMC-Abstürze',
  initComponent: function() {

    this.padding = 5;
    this.header = false;
    this.items = new Ext.Panel({
      layout: 'fit',
      title: this.title,
      frame: true,
      items: new YaVDR.Diagnose({
        items: [
          new YaVDR.Diagnose.Item({
            title: '/var/lib/vdr/.xbmc/temp/xbmc.log',
            cmd: 'get_file_content',
            file: '/var/lib/vdr/.xbmc/temp/xbmc.log'
          }),
          new YaVDR.Diagnose.Item({
            title: '/var/lib/vdr/.xbmc/temp/xbmc.old.log',
            cmd: 'get_file_content',
            file: '/var/lib/vdr/.xbmc/temp/xbmc.old.log'
          })
        ]
      })
    });

    YaVDR.Component.Diagnose.XbmcLogs.superclass.initComponent.call(this)
  }
});