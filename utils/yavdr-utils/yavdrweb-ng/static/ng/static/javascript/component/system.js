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
            flex: 0.25/*,
            handler: function(button) {
              YaVDR.openComponent(button.itemId);
            }           */
          }
        },
        items: [
          {

            items: [
              {
                itemId: '',
                text: 'System-Informationen',
                scope: YaVDR.Component.Diagnose.SystemInfos
              },
              {
                text: 'System-Logfiles',
                scope: YaVDR.Component.Diagnose.SystemLogs
              },
              {
                text: 'XBMC-Abstürze',
                scope: YaVDR.Component.Diagnose.XbmcLogs
              },
              {
                text: 'LIRC-Konfiguration',
                scope: YaVDR.Component.Diagnose.Lirc
              }
            ]
          },
          {
            items: [
              {
                text: 'VDR-Konfiguration',
                scope: YaVDR.Component.Diagnose.VDR
              },
              {
                text: 'X-Serever',
                scope: YaVDR.Component.Diagnose.X11
              },
              {
                text: 'Sound (ALSA)',
                scope: YaVDR.Component.Diagnose.SystemInfos
              },
              {
                text: 'Pakete',
                scope: YaVDR.Component.Diagnose.Dpkg
              }
            ]
          },
          {
            items: [
              {
                text: 'yaVDR-Utils',
                scope: YaVDR.Component.Diagnose.SystemInfos
              },
              {
                xtype: 'spacer',
                scope: YaVDR.Component.Diagnose.SystemInfos
              },
              {
                xtype: 'spacer',
                scope: YaVDR.Component.Diagnose.SystemInfos
              },
              {
                xtype: 'spacer',
                scope: YaVDR.Component.Diagnose.SystemInfos
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
