YaVDR.Component.System = Ext.extend(YaVDR.Component, {
  itemId: 'system',
  title: 'System',
  description: 'Hier haben Sie die Möglichkeit Ihr System zu überwachen.',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: 'Befehle',
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
            flex: 0.5
          }
        },
        items: [

          {

            items: [
              {
                icon: '/icons/fugue/monitor--arrow.png',
                text: 'VDR temporär auf 2. Bildschirm',
                scope: this,
                handler: this.changeVdrToSecondDisplay
              },
              {
                icon: '/icons/fugue/arrow-circle-225.png',
                text: 'Rechner neustarten',
                scope: this,
                handler: this.reboot
              }
            ]
          },
          {
            items: [
              {
                icon: '/icons/fugue/arrow-step.png',
                text: 'XBMC-Beendung erzwingen',
                scope: this,
                handler: this.killXBMC
              },
              {
                icon: '/icons/fugue/arrow-circle-double-135.png',
                text: 'VDR-Backend neustarten',
                scope: this,
                handler: this.restartVDR
              }
            ]
          }
        ]
      }),
      new YaVDR.Component.Item({
        title: 'Diagnose',
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
                icon: '/icons/fugue/system-monitor.png',
                text: 'System-Informationen'
              },
              {
                itemId: 'system-diagnose-system-logs',
                icon: '/icons/fugue/script-text.png',
                text: 'System-Logfiles'
              },
              {
                itemId: 'system-diagnose-xbmc',
                icon: '/icons/fugue/exclamation.png',
                text: 'XBMC-Abstürze'
              },
              {
                itemId: 'system-diagnose-lirc',
                icon: '/icons/silk/keyboard.png',
                text: 'LIRC-Konfiguration'
              }
            ]
          },
          {
            items: [
              {
                itemId: 'system-diagnose-vdr',
                icon: '/icons/fugue/screwdriver.png',
                text: 'VDR-Konfiguration'
              },
              {
                itemId: 'system-diagnose-x11',
                icon: '/icons/fugue/television.png',
                text: 'X-Serever'
              },
              {
                itemId: 'system-diagnose-alsa',
                icon: '/icons/fugue/speaker.png',
                text: 'Sound (ALSA)'
              },
              {
                itemId: 'system-diagnose-dpkg',
                icon: '/icons/silk/package.png',
                text: 'Pakete'
              }
            ]
          },
          {
            items: [
              {
                itemId: 'system-diagnose-yavdr',
                icon: '/icons/fugue/database.png',
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
  },
  changeVdrToSecondDisplay: function() {
    this.request('/admin/set_signal?signal=change-display');
  },
  stopVDR: function() {
    this.request('/admin/set_signal?signal=stop-vdr');
  },
  restartVDR: function() {
    this.request('/admin/set_signal?signal=restart-vdr');
  },
  killXBMC: function() {
    this.request('/admin/set_signal?signal=kill-xbmc');
  },
  reboot: function() {
    this.request('/admin/set_signal?signal=reboot');
  },
  request: function(url) {
    Ext.getBody().mask("Führe Befehl aus...", 'x-mask-loading');
    Ext.Ajax.request({
      url: url,
      success: function() {
        YaVDR.notice('Führe Befehl aus', 'Der Befehl wurde ausgeführt');
        Ext.getBody().unmask();
      },
      failue: function() {
        YaVDR.alert('Führe Befehl aus', 'Der Befehl konte nicht ausgeführt werden');
        Ext.getBody().unmask();
      }
    });
  }
});

YaVDR.registerComponent(YaVDR.Component.System);
