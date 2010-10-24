YaVDR.Component.System = Ext.extend(YaVDR.Component, {
  itemId: 'system-overview',
  menuTitle: 'System',
  //iconCls: 'settings-icon',
  layout: 'auto',
  border: false,
  frame: false,
  initComponent: function() {

    this.items = [
      new YaVDR.Component.Header({
        html: 'System'
      }),
      new YaVDR.Component.Item({
        title: 'VDR'
      })
    ]
    YaVDR.Component.Settings.superclass.initComponent.call(this);
  }
});
