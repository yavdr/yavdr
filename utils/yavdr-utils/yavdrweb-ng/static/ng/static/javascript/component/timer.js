YaVDR.Component.Timer = Ext.extend(YaVDR.Component, {
  itemId: 'timer',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Header({
        html: 'Timer'
      })
    ];
    YaVDR.Component.Timer.superclass.initComponent.call(this);
  }
});

YaVDR.registerComponent(YaVDR.Component.Timer);