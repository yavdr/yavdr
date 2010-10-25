YaVDR.Component.Settings = Ext.extend(YaVDR.Component, {
  itemId: 'settings-overview',
  menuTitle: 'Einstellung',
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
        title: 'VDR',
        defaults: {
          anchor: '100%',
          margins: '5 0 0 0',
          layout: 'hbox',
          defaults: {
            xtype: 'button',
            margins:'0 5 0 0',
            height: 40,
            scale: 'medium',
            flex: 0.25,
            handler: function() {
              YaVDR.openComponent(this);
            }
          }
        },
        items: [
          {

            items: [
              {
                text: 'Allgemein',
                scope: YaVDR.Component.Settings.VdrGeneric,
                icon: '/icons/fugue/television-image.png'
              },
              {
                text: 'Kanäle',
                scope: YaVDR.Component.Settings.VdrChannels,
                icon: '/icons/fugue/book-open-list.png'
              },
              {
                xtype: 'spacer'
              },
              {
                xtype: 'spacer'
              }
            ]
          }
        ]
      }),
      new YaVDR.Component.Item({
        title: 'Hardware',
        defaults: {
          anchor: '100%',
          margins: '5 0 0 0',
          layout: 'hbox',
          defaults: {
            xtype: 'button',
            margins:'0 5 0 0',
            height: 40,
            scale: 'medium',
            flex: 0.25
          }
        },
        items: [
          {
            items: [
              {
                text: 'Fernbedinung',
                icon: '/icons/silk/keyboard.png'
              },
              {
                text: 'Tonausgabe',
                icon: '/icons/fugue/speaker.png'
              },
              {
                text: 'Anzeige',
                icon: '/icons/fugue/television.png'
              },
              {
                text: 'Sundtek'
              }
            ]
          }
        ]
      }),
      new YaVDR.Component.Item({
        title: 'System',
        defaults: {
          anchor: '100%',
          margins: '5 0 0 0',
          layout: 'hbox',
          defaults: {
            xtype: 'button',
            margins:'0 5 0 0',
            height: 40,
            scale: 'medium',
            flex: 0.25
          }
        },
        items: [
          {
            items: [
              {
                text: 'System',
                icon: '/icons/silk/computer.png'
              },
              {
                text: 'Netzwerk',
                icon: '/icons/fugue/network-ethernet.png'
              },
              {
                text: 'Pakete',
                icon: '/icons/silk/package.png'
              },
              {
                text: 'Konfigurationseditor',
                icon: '/icons/silk/page_edit.png'
              }
            ]
          }
        ]
      })
    ];
    YaVDR.Component.Settings.superclass.initComponent.call(this);
  }
});
