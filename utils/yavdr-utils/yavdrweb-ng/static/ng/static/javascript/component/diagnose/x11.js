YaVDR.Component.Diagnose.X11 = Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-x11',
  title: 'X-Server',
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
            title: 'X-Server Configuration (only if NVIDIA VDPAU present)',
            cmd: 'get_file_content',
            file: '/etc/X11/xorg.conf.yavdr'
          }),
          new YaVDR.Diagnose.Item({
            title: 'XSession.vdr',
            cmd: 'get_file_content',
            file: '/etc/X11/Xsession.vdr'
          }),
          new YaVDR.Diagnose.Item({
            title: 'X-Server Logfile',
            cmd: 'get_file_content',
            file: '/var/log/Xorg.1.log'
          })
        ]
      })
    });

    YaVDR.Component.Diagnose.X11.superclass.initComponent.call(this)
  }
});