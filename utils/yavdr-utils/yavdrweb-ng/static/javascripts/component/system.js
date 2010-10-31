YaVDR.Component.System = Ext.extend(YaVDR.Component, {
  itemId: 'system',
  title: 'System',
  description: 'Here you can monitor your system. You can look into log files and send them to pastebin to let others review them.',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Item({
        title: 'Befehle',
        style: 'margin-bottom: 5px',
				items: YaVDR.createSubmenu(YaVDR.Component.System.menu['commands'], 2)
      }),
      new YaVDR.Component.Item({
        title: 'Diagnose',
				items: YaVDR.createSubmenu(YaVDR.Component.System.menu['diagnose'], 4)

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

YaVDR.Component.System.menu = new Array;
YaVDR.Component.System.menu['commands'] = new Array;
YaVDR.Component.System.menu['diagnose'] = new Array;

Ext.apply(YaVDR.Component.System, {
	addCommand: function(label, handler, icon, scope) {
		YaVDR.Component.System.menu['commands'].push({
			scope: scope,
			text: label,
			handler: handler,
			icon: icon
		});
	},
	addMenu: function(section, itemId, label, icon) {
		YaVDR.Component.System.menu[section].push({
			itemId: itemId,
			text: label,
			icon: icon
		});
	}
});

YaVDR.Component.System.addCommand('Switch temporary to second screen', YaVDR.Component.Settings.prototype.changeVdrToSecondDisplay, '/icons/fugue/monitor--arrow.png');
YaVDR.Component.System.addCommand('Reboot computer', YaVDR.Component.Settings.prototype.reboot, '/icons/fugue/arrow-circle-225.png');
YaVDR.Component.System.addCommand('Kill XBMC', YaVDR.Component.Settings.prototype.killXBMC, '/icons/fugue/arrow-step.png');
YaVDR.Component.System.addCommand('Restart VDR', YaVDR.Component.Settings.prototype.restartVDR, '/icons/fugue/arrow-circle-double-135.png');

YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-system-infos', 'System Information', '/icons/fugue/system-monitor.png');
YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-system-logs', 'System log files', '/icons/fugue/script-text.png');
YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-xbmc', 'XBMC crash log', '/icons/fugue/exclamation.png');
YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-lirc', 'LIRC configuration', '/icons/silk/keyboard.png');
YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-vdr', 'VDR configuration', '/icons/fugue/screwdriver.png');
YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-x11', 'Xorg server', '/icons/fugue/television.png');
YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-alsa', 'Sound (ALSA)', '/icons/fugue/speaker.png');
YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-dpkg', 'System Information', '/icons/silk/package.png');
YaVDR.Component.System.addMenu('diagnose', 'system-diagnose-yavdr', 'yaVDR database', '/icons/fugue/database.png');
YaVDR.registerComponent(YaVDR.Component.System);
