YaVDR.Component.Settings = Ext.extend(YaVDR.Component, {
  itemId: 'settings-overview',
  menuTitle: 'Einstellung',
  //iconCls: 'settings-icon',
  layout: 'auto',
  border: false,
  frame: false,
  initComponent: function() {

    this.items = [
      new YaVDR.Component.Header({
        html: 'Einstellung'
      }),
      new YaVDR.Component.Item({
        title: 'Einleitung',
        html: 'Hier haben Sie die Möglichkeit die Einstellungen Ihres VDRs vorzunehmen.'
      }),
      new YaVDR.Component.Item({
        title: 'VDR'
      }),
      new YaVDR.Component.Item({
        title: 'Hardware'
      }),
      new YaVDR.Component.Item({
        title: 'System'
      })
    ]
    YaVDR.Component.Settings.superclass.initComponent.call(this);
  }
});
