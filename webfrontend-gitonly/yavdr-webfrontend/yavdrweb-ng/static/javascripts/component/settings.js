YaVDR.Component.Settings = Ext.extend(YaVDR.Component, {
	itemId: 'settings',
	title: _('Settings'),
	description: _('Here you can configure your VDR and applications around it.'),
	initComponent: function() {
		this.items = [
			new YaVDR.Component.Item({
				title: _('VDR'),
				style: 'margin-bottom: 5px',
				items: YaVDR.createSubmenu(YaVDR.Component.Settings.menu['vdr'], 4)
			}),
			new YaVDR.Component.Item({
				title: _('Hardware'),
				style: 'margin-bottom: 5px',
				items: YaVDR.createSubmenu(YaVDR.Component.Settings.menu['hw'], 4)
			}),
			new YaVDR.Component.Item({
				title: _('System'),
				items: YaVDR.createSubmenu(YaVDR.Component.Settings.menu['system'], 4)
			})
		];
		YaVDR.Component.Settings.superclass.initComponent.call(this);
	}
});

YaVDR.Component.Settings.menu = new Array;
YaVDR.Component.Settings.menu['vdr'] = new Array;
YaVDR.Component.Settings.menu['hw'] = new Array;
YaVDR.Component.Settings.menu['system'] = new Array;

Ext.apply(YaVDR.Component.Settings, {
	addMenu: function(section, itemId, label, icon) {
		YaVDR.Component.Settings.menu[section].push({
			itemId: itemId,
			text: label,
			icon: icon
		});
	}
});

YaVDR.Component.Settings.addMenu('vdr', 'settings-vdr-generic', _('General'), '/icons/fugue/television-image.png');
YaVDR.Component.Settings.addMenu('vdr', 'settings-vdr-channels', _('Channels'), '/icons/fugue/book-open-list.png');

YaVDR.Component.Settings.addMenu('hw', 'settings-hw-remote', _('Remote control'), '/icons/silk/keyboard.png');
YaVDR.Component.Settings.addMenu('hw', 'settings-hw-audio', _('Audio'), '/icons/fugue/speaker.png');
YaVDR.Component.Settings.addMenu('hw', 'settings-hw-display', _('Display'), '/icons/fugue/television.png');

YaVDR.Component.Settings.addMenu('system', 'settings-system-generic', _('System'), '/icons/silk/computer.png');
YaVDR.Component.Settings.addMenu('system', 'settings-system-network', _('Network'), '/icons/fugue/network-ethernet.png');
YaVDR.Component.Settings.addMenu('system', 'settings-system-packages', _('Packages'), '/icons/silk/package.png');
YaVDR.Component.Settings.addMenu('system', 'settings-system-config-editor', _('Edit configurations'), '/icons/silk/page_edit.png');

YaVDR.registerComponent(YaVDR.Component.Settings);
