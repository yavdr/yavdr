YaVDR.Component.Recordings = Ext.extend(YaVDR.Component, {
  itemId: 'recordings',
  title: 'Recordings',
  initComponent: function() {
    YaVDR.Component.Recordings.superclass.initComponent.call(this);
  }
});

YaVDR.registerComponent(YaVDR.Component.Recordings);
