YaVDR.Component.Dashboard = Ext.extend(YaVDR.Component, {
	itemId: 'dashboard',
	layout:'column',
	initComponent: function() {

		//this.padding = 5;
		this.items = [

			{
				columnWidth: .5,
				baseCls:'x-plain',

				items: [
					{
						frame: true,
						autoScroll: true,
						height: 150,
						anchor: '100%',
						title: _('VDR'),
						style: 'margin: 0 5px 0px 0 ',
						tools: [
							{id: 'refresh'}
						],
						html: '<b>Status</b>: VDR gestartet<br><b>Speicherplatz</b>: 45G<br><b>Frontend</b>: Xine<br><b>Auflösung</b>: 1920x1080<br>Achtung Demo Inhalt'
					}//,

					//new YaVDR.Component.Dashboard.Recordings()
					/*
					 {
					 frame: true,
					 autoScroll: true,
					 anchor: '100%',
					 height: 150,
					 title: 'Aktuelle VDR-Aufnahme',
					 style: 'margin: 0 5px 0 0 ',
					 tools: [
					 {id: 'refresh'}
					 ],
					 html: '* Filme 1<br>* Filme 1<br>* Filme 1<br>* Filme 1<br>* Filme 1<br>* Filme 1<br>'
					 }*/
				]
			},
			{
				columnWidth: .5,
				baseCls:'x-plain',
				items: [

					{
						frame: true,
						autoScroll: true,
						height: 150,
						anchor: '100%',
						title: _('System'),
						tools: [
							{id: 'refresh'}
						],
						style: 'margin: 0 0 0px 0 ',
						html: '<b>Shutdown</b>: S3 (Disabled USB-Wakeup)<br> <b>CPU</b>: 10% - <b>RAM</b>: 1024MB (169 MG frei)<br><b>Soundausgabe</b>: HDMI + Analog<br>Achtung Demo Inhalt'
					}//,
					//new YaVDR.Component.Dashboard.Timers()
				]
			}

		];

		YaVDR.Component.Dashboard.superclass.initComponent.call(this);
	}
});

YaVDR.registerComponent(YaVDR.Component.Dashboard);

YaVDR.Component.Dashboard.Item = Ext.extend(Ext.Panel, {
	frame: true,
	autoScroll: true,
	anchor: '100%',
	height: 250,
	layout: 'fit',
	initComponent: function() {
		YaVDR.Component.Dashboard.Item.superclass.initComponent.call(this);
	}
});


YaVDR.Component.Dashboard.Recordings = Ext.extend(YaVDR.Component.Dashboard.Item, {
	title: _('Recordings'),
	style: 'margin: 0 5px 0 0 ',
	initComponent: function() {

		this.tools = [
			{
				id: 'refresh',
				scope: this,
				handler: this.reload
			}
		],

		this.store = new YaVDR.RecordingsStore({ autoLoad: true, baseParams: { limit: 10 } });

		this.gridPanel = new Ext.grid.GridPanel({
			bodyCssClass: 'frame-border',
			autoExpandColumn: 'name',
			loadMask: true,
			viewConfig: {
				forceFit: true
			},
			disableSelection: true,
			columns: [
				{ header: _('Name'), dataIndex: 'name', width: 400 },
				{ header: _('Duration'), dataIndex: 'length', width: 100 }
			],
			store: this.store
		});

		this.items = [this.gridPanel];

		YaVDR.Component.Dashboard.Recordings.superclass.initComponent.call(this);
	},
	reload: function() {
		this.store.reload();
	}
});


YaVDR.Component.Dashboard.Timers = Ext.extend(YaVDR.Component.Dashboard.Item, {
	title: _('Timers'),
	initComponent: function() {

		this.tools = [
			{
				id: 'refresh',
				scope: this,
				handler: this.reload
			}
		],

		this.store = new YaVDR.TimersStore({ autoLoad: true, baseParams: { limit: 10 } });

		this.gridPanel = new Ext.grid.GridPanel({
			bodyCssClass: 'frame-border',
			autoExpandColumn: 'name',
			loadMask: true,
			viewConfig: {
				forceFit: true
			},
			disableSelection: true,
			columns: [
				{ header: _('Name'), dataIndex: 'name', width: 400 },
				{ header: _('Start'), dataIndex: 'start', width: 100, xtype: 'datecolumn', format: 'd.m.Y H:i' }
			],
			store: this.store
		});

		this.items = [this.gridPanel];

		YaVDR.Component.Dashboard.Timers.superclass.initComponent.call(this);
	},
	reload: function() {
		this.store.reload();
	}
});
