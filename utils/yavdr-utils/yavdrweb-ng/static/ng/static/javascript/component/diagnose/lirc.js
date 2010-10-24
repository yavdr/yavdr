YaVDR.Component.Diagnose.Lirc = Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-lirc',
  title: 'Lirc-Konfiguration',
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
            title: 'LIRC Hardware Configuration',
            cmd: 'get_file_content',
            file: '/etc/lirc/hardware.conf'
          }),
          new YaVDR.Diagnose.Item({
            title: 'LIRCD Configuration',
            cmd: 'get_file_content',
            file: '/etc/lirc/lircd.conf'
          })
        ]
      })
    });

    YaVDR.Component.Diagnose.Lirc.superclass.initComponent.call(this)
  }
});