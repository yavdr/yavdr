YaVDR.Component.Timer = Ext.extend(YaVDR.Component, {
  itemId: 'timer',
  title: _('Timer'),
  initComponent: function() {

    YaVDR.Component.Timer.superclass.initComponent.call(this);
  }
});

YaVDR.registerComponent(YaVDR.Component.Timer);