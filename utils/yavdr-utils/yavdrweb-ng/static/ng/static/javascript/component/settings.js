YaVDR.Component.Settings = Ext.extend(YaVDR.Component, {
  itemId: 'settings',
  menuTitle: 'Einstellung',
  //iconCls: 'settings-icon',
  layout: 'auto',
  border: false,
  frame: false,
  initComponent: function() {

    this.items = [
      {
        xtype: 'box',
        style: 'color: #233d6d ;font-weight: bold; font-size: 1.4em; margin: 0 0 10px 3px; font-family: sans-serif;',
        html: 'Einstellungen'
      },
      {
        frame: true,
        title: 'VDR',
      }
    ]
    YaVDR.Component.Settings.superclass.initComponent.call(this);
  }
});
