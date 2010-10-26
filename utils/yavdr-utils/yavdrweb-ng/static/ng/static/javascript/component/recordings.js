YaVDR.Component.Recordings = Ext.extend(YaVDR.Component, {
  itemId: 'recordings',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Header({
        html: 'Aufnahmen'
      })
    ];
    YaVDR.Component.Recordings.superclass.initComponent.call(this);
  }
});

YaVDR.registerComponent(YaVDR.Component.Recordings);