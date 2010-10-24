YaVDR.Component.Diagnose.VDR= Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-vdr',
  title: 'VDR-Konfiguration',
  initComponent: function() {

    //this.padding = 5;
    this.header = false;
    this.items = new Ext.Panel({
      layout: 'fit',
      title: this.title,
      frame: true,
      items: new YaVDR.Diagnose({
        items: [
          new YaVDR.Diagnose.Item({
            title: 'VDR Setup',
            cmd: 'get_file_content',
            file: '/etc/vdr/setup.conf'
          }),
          new YaVDR.Diagnose.Item({
            title: 'VDR Fernbedienung',
            cmd: 'get_file_content',
            file: '/etc/vdr/remote.conf'
          })
        ]
      })
    });

    YaVDR.Component.Diagnose.VDR.superclass.initComponent.call(this)
  }
});