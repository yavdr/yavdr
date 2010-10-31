YaVDR.Component.Settings = Ext.extend(YaVDR.Component, {
  itemId: 'settings',
  title: 'Settings',
  description: 'Here you can configure your VDR and applications around it.',
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
                text: 'General',
                itemId: 'settings-vdr-generic',
                icon: '/icons/fugue/television-image.png'
              },
              {
                text: 'Channels',
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
                text: 'Remote Control Settings',
                itemId: 'settings-hw-remote',
                icon: '/icons/silk/keyboard.png'
              },
              {
                itemId: 'settings-hw-audio',
                text: 'Audio Configuration',
                icon: '/icons/fugue/speaker.png'
              },
              {
                text: 'Display Settings',
                itemId: 'settings-hw-display',
                icon: '/icons/fugue/television.png'
              },
              {
                text: 'Sundtek',
                itemId: 'settings-hw-sundtek'
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
                itemId: 'settings-system-generic',
                icon: '/icons/silk/computer.png'
              },
              {
                text: 'Network',
                itemId: 'settings-system-network',
                icon: '/icons/fugue/network-ethernet.png'
              },
              {
                text: 'Packages',
                itemId: 'settings-system-packages',
                icon: '/icons/silk/package.png'
              },
              {
                text: 'Edit Configurations',
                itemId: 'settings-system-config-editor',
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
