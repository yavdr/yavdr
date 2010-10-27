YaVDR.Component.System = Ext.extend(YaVDR.Component, {
  itemId: 'system',
  title: 'System',
  description: 'Hier haben Sie die Möglichkeit Ihr System zu überwachen.',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: 'Diagnose',
        style: 'padding-bottom: 5px',
        defaults: {
          anchor: '100%',
          margins: '5 0 0 0',
          layout: 'hbox',
          defaults: {
            xtype: 'button',
            margins:'0 5 5 0',
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
                itemId: 'system-diagnose-system-infos',
                text: 'System-Informationen'
              },
              {
                itemId: 'system-diagnose-system-logs',
                text: 'System-Logfiles'
              },
              {
                itemId: 'system-diagnose-xbmc',
                text: 'XBMC-Abstürze'
              },
              {
                itemId: 'system-diagnose-lirc',
                text: 'LIRC-Konfiguration'
              }
            ]
          },
          {
            items: [
              {
                itemId: 'system-diagnose-vdr',
                text: 'VDR-Konfiguration'
              },
              {
                itemId: 'system-diagnose-x11',
                text: 'X-Serever'
              },
              {
                itemId: 'system-diagnose-alsa',
                text: 'Sound (ALSA)'
              },
              {
                itemId: 'system-diagnose-dpkg',
                text: 'Pakete'
              }
            ]
          },
          {
            items: [
              {
                itemId: 'system-diagnose-yavdr',
                text: 'yaVDR-Utils'
              },
              {
                xtype: 'spacer'
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
      })
    ];
    YaVDR.Component.System.superclass.initComponent.call(this);
  }
});

YaVDR.registerComponent(YaVDR.Component.System);
