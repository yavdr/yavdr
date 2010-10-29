YaVDR.Network = Ext.extend(Ext.Panel, {
  layout: 'border',
  initComponent: function() {
    
    this.nfsPanel = new YaVDR.Network.Nfs({
      itemId: 'nfs'
    });
    
    this.items = [
      new YaVDR.BaseTabPanel({
        region: 'center',
        items: [this.nfsPanel]
      }),
      {
        cls: 'frame-panel-border',
        style: 'background-color: #FFF',
        region: 'south',
        margins: '5 0 0 0',
        padding: 6,
        html: '<p style="font-size: 12px;">' + getLL("network.nfs.help") + "</p>"
      }
    ];
    
    YaVDR.Network.superclass.initComponent.call(this);
  }
});

YaVDR.Network.Nfs = Ext.extend(Ext.grid.GridPanel, {
  autoScroll: true,
  loadMask: true,
  title: 'NFS',
  stripeRows: true,
  autoExpandColumn: 'netspec',
  bodyStyle: 'background-color: #DFE8F6;',
  initComponent: function() {
    
    this.viewConfig = {
      forceFit: true
    }
    
    this.sm = new Ext.grid.RowSelectionModel({ singleSelect:true });
    
    this.tbar = [
      {
        xtype: 'textfield',
        itemId: 'remote',
        width: 300
      },
      {
        icon: '/static/images/icons/socket--plus.png',
        text: 'Hinzufügen',
        scope: this,
        handler: this.addExport
      },
      {
        icon: '/static/images/icons/socket--pencil.png',
        text: 'Ändern',
        scope: this,
        handler: this.changeExport
      },
      {
        icon: '/static/images/icons/socket--minus.png',
        text: 'Löschen',
        scope: this,
        handler: this.deleteExport
      },
      {
        icon: '/static/images/icons/socket--arrow.png',
        text: 'Übernehmen',
        scope: this,
        handler: this.saveExports
      }

    ];

    this.columns = [
      {
        dataIndex: 'netspec'
      }
    ];
  
    this.store = new Ext.data.Store({
      url: '/admin/get_autofs_config?cmd=mounts',
      reader: new Ext.data.ArrayReader({}, Ext.data.Record.create([{name: 'netspec'}])) 
    });
    
    YaVDR.Network.Nfs.superclass.initComponent.call(this);
    
    this.on('rowclick', this.selectForEdit, this);
    this.on('render', function() {
      this.store.reload();
    }, this);
  },
  saveExports: function() {
    var mounts = [];
    this.loadMask.show()
    Ext.each(this.store.getRange(), function(k) {
        mounts.push( k.data.netspec );
    }, this);
    
    params = { 'cmd' : 'mounts' }
    if(mounts.length > 0) params.mounts = mounts
    
    Ext.Ajax.request({
      scope: this,
      url: '/admin/set_autofs_config',
      timeout: 10000,
      method:  'GET',
      params: params,
      waitMsg: 'wait',
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      success: function(xhr) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("network.submit.success") );
        this.loadMask.hide();
        this.store.reload();
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("network.submit.failure") );
        this.loadMask.hide();
      }
    })              
  },
  selectForEdit: function(grid, rowIndex, e) {
    var record = this.store.getAt(rowIndex);
    var remote = this.getTopToolbar().getComponent('remote');
    remote.setValue(record.data.netspec);
  },
  addExport: function() {
    var remote = this.getTopToolbar().getComponent('remote');
    if(!remote.getValue()) {
      remote.markInvalid('Gebe einen Namen an')
    } else {
      var record = new this.store.recordType({netspec: remote.getValue()});
      record.markDirty();
      this.store.add(record);
      remote.setValue();
    }
  },
  deleteExport: function() {
    if(this.getSelectionModel().getSelected()) {
      this.store.remove(this.getSelectionModel().getSelected());
    }
  },
  changeExport: function() {
    var remote = this.getTopToolbar().getComponent('remote');
    this.getSelectionModel().getSelected().set('netspec', remote.getValue());
    remote.setValue();
  }
});

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                layout: 'fit',
                section: "network",
                items:   function() {
                  return new YaVDR.Network
                }});
  
});