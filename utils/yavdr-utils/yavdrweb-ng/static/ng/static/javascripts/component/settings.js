YaVDR.Component.Settings = Ext.extend(YaVDR.Component, {
  itemId: 'settings',
  title: 'Einstellung',
  description: 'Hier haben Sie die Möglichkeit die Einstellungen Ihres VDRs vorzunehmen.',
  initComponent: function() {

    this.items = [
      new YaVDR.Component.Item({
        title: 'VDR',
        style: 'margin-bottom: 5px',
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
            handler: function(button) {
              YaVDR.openComponent(button.itemId);
            }
          }
        },
        items: [
          {

            items: [
              {
                text: 'Allgemein',
                itemId: 'settings-vdr-generic',
                icon: '/icons/fugue/television-image.png'
              },
              {
                text: 'Kanäle',
                itemId: 'settings-vdr-channels',
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
        style: 'margin-bottom: 5px',
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
            handler: function(button) {
              YaVDR.openComponent(button.itemId);
            }
          }
        },
        items: [
          {
            items: [
              {
                text: 'Fernbedinung',
                itemId: 'settings-hw-remote',
                icon: '/icons/silk/keyboard.png'
              },
              {
                itemId: 'settings-hw-audio',
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
            flex: 0.25,
            handler: function(button) {
              YaVDR.openComponent(button.itemId);
            }
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
                itemId: 'settings-system-network',
                icon: '/icons/fugue/network-ethernet.png'
              },
              {
                text: 'Pakete',
                itemId: 'settings-system-packages',
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

YaVDR.registerComponent(YaVDR.Component.Settings);
