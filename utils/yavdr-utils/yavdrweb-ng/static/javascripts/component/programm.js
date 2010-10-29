YaVDR.Component.Programm = Ext.extend(YaVDR.Component, {
  itemId: 'programm',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Header({
        html: 'Schedule'
      })
    ];
    YaVDR.Component.Programm.superclass.initComponent.call(this);
  }
});

YaVDR.registerComponent(YaVDR.Component.Programm);
