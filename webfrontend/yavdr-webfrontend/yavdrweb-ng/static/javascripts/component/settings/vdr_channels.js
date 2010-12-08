YaVDR.Component.Settings.VdrChannels = Ext.extend(YaVDR.Component, {
  itemId: 'settings-vdr-channels',
  layout: 'border',
  initComponent: function() {
    this.initStore();
    this.initGrid();
    
    this.items = [
      new YaVDR.Component.Header({
        region: 'north',
        html: 'Settings'
      }),
      new YaVDR.Component.Item({
        region: 'center',
        title: 'Channel List',
        layout: 'fit',
        items: this.grid
      })

    ];
    YaVDR.Component.Settings.VdrChannels.superclass.initComponent.call(this);
    this.on('render', this.loadStore, this);
      
  },
  loadStore: function() {
    this.store.reload();
  },
  initGrid: function() {
    this.grid = new Ext.grid.GridPanel({
      store: this.store,
      style: 'border: 1px solid #D0D0D0;',
      columns: [
        {header: "Nr.",  align: 'right', width: 40, dataIndex: '_num', sortable: true},
        {header: "Name",  align: 'left', width: 160, dataIndex: 'name', sortable: true},
        {header: "Anbieter",  align: 'left', width: 100, dataIndex: 'prov', sortable: true},
        {header: "TV/Radio",  align: 'center', width: 50, dataIndex: '_friendly_type', sortable: true},
        {header: "FTA/verschlüsselt",  align: 'center', width: 70, dataIndex: '_friendly_scrambled', sortable: true},
        {header: "Sprache",  align: 'center', width: 70, dataIndex: '_friendly_lang', sortable: true},
        {header: "Transponder",  align: 'left', width: 140, dataIndex: '_friendly_transp', sortable: true},
        {header: "Modulation",  align: 'left', width: 140, dataIndex: 'mod', sortable: true},
        {header: "Sat-Empfangsbereich",  align: 'left', width: 160, dataIndex: '_friendly_dvb_sat_band', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.source"),  align: 'left', width: 50, dataIndex: 'src', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.frequency"),  align: 'right', width: 70, dataIndex: 'freq', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.symbolrate"),  align: 'right', width: 70, dataIndex: 'symb', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.vpid"),  align: 'left', width: 90, dataIndex: 'vpid', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.apid"),  align: 'left', width: 220, dataIndex: 'apid', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.tpid"),  align: 'right', width: 40, dataIndex: 'tpid', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.caid"),  align: 'left', width: 70, dataIndex: 'caid', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.sid"),  align: 'right', width: 40, dataIndex: 'sid', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.nid"),  align: 'right', width: 40, dataIndex: 'nid', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.tid"),  align: 'right', width: 40, dataIndex: 'tid', sortable: true, hidden: true},
        //{header: getLL("channels.grid_header.rid"),  align: 'right', width: 40, dataIndex: 'rid', sortable: true, hidden: true},
        {header: "Gruppe",  align: 'left', width: 150, dataIndex: '_group', sortable: true}
      ],
      view: new Ext.grid.GroupingView({
        forceFit: true,
        autoFill :true,
        hideGroupedColumn: true,
        showGroupName: false,
        startCollapsed: true,
        groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})'
      }),
      loadMask: "Lade Kannäle"
    });



  },
  initStore: function() {
    this.reader = new Ext.data.JsonReader({
      idProperty: '_num',
      remoteSort: false,
      root: 'channelList',
      totalProperty: 'totalCount',
      fields: [
        '_num' , {name:'_num',  type: 'int'},
        'name', {name:'name', type: 'string'},
        'prov', {name:'prov', type: 'string'},
        '_friendly_type' , {name:'_friendly_type',  type: 'string'},
        '_friendly_scrambled' , {name:'_friendly_scrambled',  type: 'string'},
        '_friendly_lang' , {name:'_friendly_lang',  type: 'string'},
        '_friendly_transp' , {name:'_friendly_transp',  type: 'string'},
        'mod'  , {name:'mod',  type: 'string'},
        '_group', {name:'_group',  type: 'string'},
        '_friendly_dvb_sat_band' , {name:'_friendly_dvb_sat_band',  type: 'string'}
        //'src' , {name:'src',  type: 'string'},
        //'freq' , {name:'freq', type: 'int'},
        //'symb' , {name:'symb', type: 'int'},
        //'vpid' , {name:'vpid',  type: 'string'},
        //'apid' , {name:'apid',  type: 'string'},
        //'tpid' , {name:'tpid',  type: 'string'},
        //'caid' , {name:'caid',  type: 'string'},
        //'sid'  , {name:'sid',  type: 'string'},
        //'nid'  , {name:'nid',  type: 'string'},
        //'tid'  , {name:'tid',  type: 'string'},
        //'rid'  , {name:'rid',  type: 'string'}
      ]
    });
    this.store = new Ext.data.GroupingStore({
        autoLoad: false,
        url: '/admin/get_svdrp_response?command=LSTC',
        groupField: '_group',
        reader: this.reader
    });
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.VdrChannels);

