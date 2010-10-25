YaVDR.Component.Diagnose.ALSA = Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-alsa',
  title: 'Sound (ALSA)',
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

    YaVDR.Component.Diagnose.ALSA.superclass.initComponent.call(this)
  }
});