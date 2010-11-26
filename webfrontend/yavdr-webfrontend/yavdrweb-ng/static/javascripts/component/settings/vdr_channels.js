YaVDR.Component.Settings.VdrChannels = Ext.extend(YaVDR.Component, {
  itemId: 'settings-vdr-channels',
  layout: 'border',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Header({
        region: 'north',
        html: 'Settings'
      }),
      new YaVDR.Component.Item({
        region: 'center',
        style: '',
        title: 'Channel List',
        html: 'Channels'
        //items: new YaVDR.Component.Settings.VdrGeneric.Frontend
      })
    ];
    YaVDR.Component.Settings.VdrChannels.superclass.initComponent.call(this);
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.VdrChannels);
