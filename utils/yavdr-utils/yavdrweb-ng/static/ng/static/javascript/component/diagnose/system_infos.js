YaVDR.Component.Diagnose.SystemInfos = Ext.extend(YaVDR.Component, {
  layout: 'fit',
  itemId: 'diagnose-system-infos',
  title: 'System-Informationen',
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
            title: getLL("diagnose.section.system_info.top"),
            cmd: 'get_shell_response',
            file: 'top'
          }),
          new YaVDR.Diagnose.Item({
            title: getLL("diagnose.section.system_info.ifconfig"),
            cmd: 'get_shell_response',
            file: 'ifconfig'
          }),
          new YaVDR.Diagnose.Item({
            title: getLL("diagnose.section.system_info.df"),
            cmd: 'get_shell_response',
            file: 'df'
          }),
          new YaVDR.Diagnose.Item({
            title: getLL("diagnose.section.system_info.dmesg"),
            cmd: 'get_shell_response',
            file: 'dmesg'
          })
        ]
      })
    });

    YaVDR.Component.Diagnose.SystemInfos.superclass.initComponent.call(this)
  }
});