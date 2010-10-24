YaVDR.Component.Diagnose.YaVDR = Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-yavdr',
  title: 'yaVDR-Utils',
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
            title: 'yaVDR DB',
            cmd: 'get_file_content',
            file: '/var/lib/yavdrdb.hdf'
          }),
          new YaVDR.Diagnose.Item({
            title: 'Logfile Webserver',
            cmd: 'get_file_content',
            file: '/var/log/tntnet/tntnet.log'
          })
        ]
      })
    });

    YaVDR.Component.Diagnose.YaVDR.superclass.initComponent.call(this)
  }
});