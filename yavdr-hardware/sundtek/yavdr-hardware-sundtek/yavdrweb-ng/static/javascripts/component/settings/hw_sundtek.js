YaVDR.Component.Settings.HwSundtek = Ext.extend(YaVDR.Component, {
	itemId: 'settings-hw-sundtek',
	description: 'You can configure your sundtek DVB hardware here.',
	title: 'Sundtek',
	initComponent: function() {
		this.items = [
			new YaVDR.Component.Item({
				title: 'Sundtek Settings',
				style: 'margin-bottom: 5px',
				items: new YaVDR.Component.Settings.HwSundtek.Hardware
			})
		];
		YaVDR.Component.Settings.HwAudio.superclass.initComponent.call(this);
	}
});
YaVDR.registerComponent(YaVDR.Component.Settings.HwSundtek);


YaVDR.Component.Settings.HwSundtek.Hardware = Ext.extend(YaVDR.Default.Form, {
	initComponent: function() {

		this.sundtek = new Ext.form.RadioGroup({
			fieldLabel: 'Sundtek DVB mode',
			items: [
				{
					itemId: 'dvbc',
					boxLabel: 'DVB-C',
					name: 'mode',
					inputValue: 'DVBC'
				},
				{
					itemId: 'dvbt',
					boxLabel: 'DVB-T',
					name: 'mode',
					inputValue: 'DVBT'
				}
			]
		});

		this.items = [
			this.sundtek
		];

		YaVDR.Component.Settings.HwSundtek.Hardware.superclass.initComponent.call(this);
	},
	doLoad: function() {
		Ext.Ajax.request({
			url: '/sundtek/get_dvb',
			method: 'GET',
			scope: this,
			success: function(xhr) {
				var currentSundtek = "";
				currentSundtek = xhr.responseText;
				this.sundtek.setValue(currentSundtek);
			}
		});
	},
	doSave: function() {
		this.getForm().submit({
			url: '/sundtek/set_dvb'
		})
	}
});

YaVDR.Component.Settings.addMenu('hw', 'settings-hw-sundtek', 'Sundtek', null);