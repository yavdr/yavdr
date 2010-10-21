Ext.ns('YaVDR');

// base panel for each page
YaVDR.BasePanel = Ext.extend(Ext.Panel, {
  autoScroll: true,
  initComponent: function() {
    YaVDR.BasePanel.superclass.initComponent.call(this);
  }
});
YaVDR.BaseFormPanel = Ext.extend(Ext.FormPanel, {
  autoScroll: true,
  buttonAlign: 'left',
  labelWidth: 200,
  initComponent: function() {
    YaVDR.BaseFormPanel.superclass.initComponent.call(this);
  }
});
