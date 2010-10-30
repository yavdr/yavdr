YaVDR.Component.System = Ext.extend(YaVDR.Component, {
  itemId: 'system',
  title: 'System',
  description: 'Here you can monitor your system. You can look into log files and send them to pastebin to let others review them.',
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
                text: 'Switch temporary to second screen',
                scope: this,
                handler: this.changeVdrToSecondDisplay
              },
              {
                icon: '/icons/fugue/arrow-circle-225.png',
                text: 'Reboot computer',
                scope: this,
                handler: this.reboot
              }
            ]
          },
          {
            items: [
              {
                icon: '/icons/fugue/arrow-step.png',
                text: 'Kill XBMC',
                scope: this,
                handler: this.killXBMC
              },
              {
                icon: '/icons/fugue/arrow-circle-double-135.png',
                text: 'Restart VDR',
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
                text: 'System Information'
              },
              {
                itemId: 'system-diagnose-system-logs',
                icon: '/icons/fugue/script-text.png',
                text: 'System log files'
              },
              {
                itemId: 'system-diagnose-xbmc',
                icon: '/icons/fugue/exclamation.png',
                text: 'XBMC crash log'
              },
              {
                itemId: 'system-diagnose-lirc',
                icon: '/icons/silk/keyboard.png',
                text: 'LIRC configuration'
              }
            ]
          },
          {
            items: [
              {
                itemId: 'system-diagnose-vdr',
                icon: '/icons/fugue/screwdriver.png',
                text: 'VDR configuration'
              },
              {
                itemId: 'system-diagnose-x11',
                icon: '/icons/fugue/television.png',
                text: 'Xorg server'
              },
              {
                itemId: 'system-diagnose-alsa',
                icon: '/icons/fugue/speaker.png',
                text: 'Sound (ALSA)'
              },
              {
                itemId: 'system-diagnose-dpkg',
                icon: '/icons/silk/package.png',
                text: 'Package information'
              }
            ]
          },
          {
            items: [
              {
                itemId: 'system-diagnose-yavdr',
                icon: '/icons/fugue/database.png',
                text: 'yaVDR database'
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
    Ext.getBody().mask("Execute command...", 'x-mask-loading');
    Ext.Ajax.request({
      url: url,
      success: function() {
        YaVDR.notice('Execute command', 'The command has been executed successfully');
        Ext.getBody().unmask();
      },
      failue: function() {
        YaVDR.alert('Execute command', 'The command could not complete successfully');
        Ext.getBody().unmask();
      }
    });
  }
});

YaVDR.registerComponent(YaVDR.Component.System);
