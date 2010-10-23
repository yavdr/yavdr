YaVDR.Component.Diagnose.SystemLogs = Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-system-logs',
  title: 'System-Logfiles',
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
            title: '/var/log/messages',
            cmd: 'get_file_content',
            file: '/var/log/messages'
          }),
          new YaVDR.Diagnose.Item({
            title: '/var/log/user.log',
            cmd: 'get_file_content',
            file: '/var/log/user.log'
          }),
          new YaVDR.Diagnose.Item({
            title: '/var/log/syslog',
            cmd: 'get_file_content',
            file: '/var/log/syslog'
          })
        ]
      })
    });

    YaVDR.Component.Diagnose.SystemLogs.superclass.initComponent.call(this)
  }
});