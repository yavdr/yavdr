YaVDR.Component.Recordings = Ext.extend(YaVDR.Component, {
	itemId: 'recordings',
	layout: 'border',
	initComponent: function() {

		this.store = new YaVDR.RecordingsStore({ autoLoad: true });

		this.detailPanel = new Ext.Panel({
			bodyCssClass: 'frame-border',
			padding: 5,
			style: 'background-color: #FFF',
			region: 'south',
			split: true,
			height: 50,
			itemId: 'detail'
		});

		this.gridPanel = new Ext.grid.GridPanel({
			bodyCssClass: 'frame-border',
			tbar: [
				{
					icon: '/icons/silk/arrow_refresh.png',
					text: 'Reload',
					scope: this,
					handler: this.reloadStore
				}
			],
			viewConfig: {
				forceFit: true
			},
			columns: [
				{ header: 'Name', dataIndex: 'name' },
				{ header: 'Dauer', dataIndex: 'length' }
			],
			store: this.store,
			itemId: 'list',
			region: 'center',
			margins: '0 0 0 0'
		});

		this.items = [
			new YaVDR.Component.Header({
				html: 'Recordings',
				region: 'north'
			}),
			{
				frame: true,
				region: 'center',
				layout: 'border',
				header: true,
				//title: 'Recordings',
				items: [
					this.gridPanel,
					this.detailPanel
				]
			}
		];

		YaVDR.Component.Recordings.superclass.initComponent.call(this);
		this.gridPanel.getSelectionModel().on('rowselect', this.updateDetailOnSelect, this);
		this.gridPanel.getSelectionModel().on('rowdeselect', this.updateDetailOnDeselect, this);
	},
	updateDetailOnDeselect: function() {
		this.detailPanel.update("");
	},
	updateDetailOnSelect: function(sm, rowIndex, record) {
		this.detailPanel.update(record.data.information);
	},
	reloadStore: function() {
		this.store.reload();
	}
});

YaVDR.registerComponent(YaVDR.Component.Recordings);
