YaVDR.Component.Diagnose.Dpkg = Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-dpkg',
  title: 'Pakete',
  initComponent: function() {

    this.padding = 10;
    this.items = new Ext.Panel({
      layout: 'fit',
      title: this.title,
      frame: true,
      items: new YaVDR.Diagnose({
        items: [
          new YaVDR.Diagnose.Item({
            title: 'Alsa Device List',
            cmd: 'get_shell_response',
            file: 'aplay'
          }),
          new YaVDR.Diagnose.Item({
            title: 'Alsa Custom Sound Configuration',
            cmd: 'get_file_content',
            file: '/etc/asound.conf'
          })
        ]
      })
    });

    YaVDR.Component.Diagnose.Dpkg.superclass.initComponent.call(this)
  }
});