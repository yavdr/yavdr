YaVDR.Component.Settings.SystemNetwork = Ext.extend(YaVDR.Component, {
  itemId: 'settings-system-network',
  layout: 'border',
  initComponent: function() {
    this.items = [
      new YaVDR.Component.Header({
        region: 'north',
        html: _('Settings')
      }),
      new YaVDR.Component.Item({
        region: 'center',
        style: '',
        layout: 'border',
        title: _('Network'),
        items: [
          {
            plain: true,
            region: 'center',
            xtype: 'tabpanel',
            activeTab: 0,
            items: [
              new YaVDR.Component.Settings.SystemNetwork.NFS
            ]
          },
          {
            region: 'south',
            margins: '5 0 0 0',
            padding: 6,
            style: 'background-color: #FFF; border: 1px solid #D0D0D0; font-size: 12px;',
            html: _('You can define Host and shares which should be mounted automatically. You need to key in the shares using "host:/path/to/the/share".')
          }
        ]
      })
    ];
    YaVDR.Component.Settings.SystemNetwork.superclass.initComponent.call(this);
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.SystemNetwork);

YaVDR.Component.Settings.SystemNetwork.NFS = Ext.extend(Ext.grid.GridPanel, {
  autoScroll: true,
  loadMask: true,
  title: 'NFS',
  stripeRows: true,
  autoExpandColumn: 'netspec',
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
        text: 'Add',
        scope: this,
        handler: this.addExport
      },
      {
        icon: '/static/images/icons/socket--pencil.png',
        text: 'Edit',
        scope: this,
        handler: this.changeExport
      },
      {
        icon: '/static/images/icons/socket--minus.png',
        text: 'Delete',
        scope: this,
        handler: this.deleteExport
      },
      {
        icon: '/static/images/icons/socket--arrow.png',
        text: 'Save',
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
      reader: new Ext.data.ArrayReader({}, Ext.data.Record.create([
        {name: 'netspec'}
      ]))
    });

    YaVDR.Component.Settings.SystemNetwork.NFS.superclass.initComponent.call(this);

    this.on('rowclick', this.selectForEdit, this);
    this.on('render', function() {
      this.store.reload();
    }, this);
  },
  saveExports: function() {
    var mounts = [];
    this.loadMask.show()
    Ext.each(this.store.getRange(), function(k) {
      mounts.push(k.data.netspec);
    }, this);

    params = { 'cmd' : 'mounts' }
    if (mounts.length > 0) params.mounts = mounts

    Ext.Ajax.request({
      scope: this,
      url: '/admin/set_autofs_config',
      method:  'GET',
      params: params,
      success: function(xhr) {
        this.loadMask.hide();
        this.store.reload();
      },
      failure:function(form, action) {
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
    if (!remote.getValue()) {
      remote.markInvalid(_('The name is missing'))
    } else {
      var record = new this.store.recordType({netspec: remote.getValue()});
      record.markDirty();
      this.store.add(record);
      remote.setValue();
    }
  },
  deleteExport: function() {
    if (this.getSelectionModel().getSelected()) {
      this.store.remove(this.getSelectionModel().getSelected());
    }
  },
  changeExport: function() {
    var remote = this.getTopToolbar().getComponent('remote');
    this.getSelectionModel().getSelected().set('netspec', remote.getValue());
    remote.setValue();
  }
});
