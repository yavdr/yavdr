Ext.ns('YaVDR');

// base panel for each page
YaVDR.BasePanel = Ext.extend(Ext.Panel, {
  autoScroll: true,
  initComponent: function() {
    YaVDR.BasePanel.superclass.initComponent.call(this);
  }
});

YaVDR.DpkgWindow = Ext.extend(Ext.Window, {
  callback: null,
  store: null,
  command: 'install',
  title: 'yaVDR Paket Installer',
  width: 600,
  height: 450,
  resizable:false,
  closable: false,
  modal: true,
  layout: 'fit',
  id: 'dpkg',
  initComponent: function() {
    // Todo Use MIFrame
    if (this.command == 'install') {
      this.items = [
        {
          border: false,
          html: '<iframe src="dpkg?command=install&package=' + this.package + '&ts=' + ((new Date()).getTime()) + '" style="width: 584px; height: 385px;" onload="Ext.getCmp(\'closeinstaller\').enable()"></iframe>'
        }
      ];
    } else {
      this.items = [
        {
          border: false,
          html: '<iframe src="dpkg?command=' + this.command + '&ts=' + ((new Date()).getTime()) + '" style="width: 584px; height: 385px;" onload="Ext.getCmp(\'closeinstaller\').enable()"></iframe>'
        }
      ];
    }

    this.buttons = [
      {
        id: 'closeinstaller',
        disabled:true,
        scope: this,
        text: 'Close',
        handler: function() {
          this.close();
          if (typeof this.callback == 'function') {
            if (this.scope) {
              this.callback.call(this.scope);
            } else {
              this.callback();
            }
          }
        }
      }
    ];

    YaVDR.DpkgWindow.superclass.initComponent.call(this);
  }
});

YaVDR.Packages = Ext.extend(YaVDR.BasePanel, {
  layout: 'border',
  buttonAlign: 'left',
  initComponent: function() {
    this.initPackagesStore();
    this.initGridPanel();
    this.initDetailPanel();

    this.items = [this.gridPanel, this.detailPanel];
    this.buttons = [
      {
        text: 'apt-get update',
        scope: this,
        handler: this.aptUpdate
      },
      {
        text: 'apt-get autoremove',
        scope: this,
        handler: this.aptAutoRemove
      }
    ]

    YaVDR.Packages.superclass.initComponent.call(this);

    // init the events after initComponent
    this.initGridEvents();
  },
  aptUpdate: function() {
    (new YaVDR.DpkgWindow({
      scope: this,
      command: 'update',
      callback: this.reloadPackages
    })).show();
  },
  aptAutoRemove: function() {
    (new YaVDR.DpkgWindow({
      scope: this,
      command: 'autoremove',
      callback: this.reloadPackages
    })).show();
  },
  initGridEvents: function() {
    // load store only first time
    this.on('render', this.reloadPackages, this, { single: true });
    // change status on dblClick
    this.gridPanel.on('celldblclick', this.changeStatusEvent, this);
    this.gridPanel.getSelectionModel().on('rowselect', this.updateDetail, this);
  },
  detailTemplate: function() {
    return new Ext.Template([
      'Package: {Package}<br/>',
      'Maintainer: {Maintainer}<br/>',
      'Description: {Description}<br/>'
    ]);
  },
  updateDetail: function(sm, index, row) {
    this.detailTemplate().overwrite(this.detailPanel.getComponent('package-detail').body, row.data);
  },
  reloadPackages: function() {
    this.packagesStore.reload();
  },
  initPackagesStore: function() {
    this.packagesStore = new Ext.data.JsonStore({
      url: 'get_packages',
      idProperty: 'Package',
      fields: ['id', 'Package', 'Version', 'Description', 'Maintainer', 'installed' ],
      sortInfo: {
        field: 'Package',
        direction: 'ASC'
      }
    });
  },
  initDetailPanel: function() {
    // todo: check is panel best way?
    this.detailPanel = new Ext.Panel({
      region: 'south',
      anchor: '100%',
      style: 'border: 1px solid #99BBE8',
      autoScroll: true,
      bodyStyle: {
        background: '#ffffff',
        padding: '7px'
      },
      height: 82,
      items: [
        {
          itemId: 'package-detail',
          html: 'Please select a package to see additional details.'
        },
        {
          html: 'dblclick on red icon to install package.....<br/> vdr-plugins can be dis- & enabled...'
        }
      ]
    });
  },
  initGridPanel: function() {
    this.gridPanel = new Ext.grid.GridPanel({
      store: this.packagesStore,
      region: 'center',
      anchor: '100%',
      style: 'border: 1px solid #99BBE8',
      margins: '0 0 5 0',
      viewConfig: {
        forceFit: true
      },
      cm: new Ext.grid.ColumnModel({
        defaults: {
          sortable: true
        },
        columns: [
          {
            header: "",
            width: 22,
            dataIndex: 'installed',
            renderer: this.stateRenderer
          },
          {
            header: "Package",
            width: 180,
            dataIndex: 'Package'
          },
          {
            header: "Version",
            width: 180,
            dataIndex: 'Version'
          },
          {
            header: "Maintainer",
            width: 180,
            dataIndex: 'Maintainer'
          },
          {
            header: "Description",
            width: 1000,
            dataIndex: 'Description'
          }
        ]
      }),
      sm: new Ext.grid.RowSelectionModel({
        singleSelect: true
      })
    });
  },
  installPackage: function(package) {
    (new YaVDR.DpkgWindow({
      package: package,
      scope: this,
      callback: this.reloadPackages
    })).show();
  },
  changeStatusEvent: function(grid, row, col, event) {
    // correct column?
    if ('installed' == grid.getColumnModel().getDataIndex(col)) {
      var record = grid.getStore().getAt(row);
      var package = record.data.Package;
      if (record.data.installed == 0) {
        Ext.Msg.show({
          title:'Install package?',
          msg: 'Would you like to install package "' + Ext.util.Format.htmlEncode(package) + '"?',
          buttons: Ext.Msg.YESNO,
          animEl: 'elId',
          scope: this,
          icon: Ext.MessageBox.QUESTION,
          fn: function(button) {
            if (button == 'yes') {
              this.installPackage.call(this, package);
            }
          }
        });
      } else if (record.data.Package.substr(0, 11) == "vdr-plugin-") {
        if (record.data.installed == 2) {
          Ext.Msg.show({
            title:'disable plugin?',
            msg: 'Would you like to disable "' + Ext.util.Format.htmlEncode(package) + '"?',
            buttons: Ext.Msg.YESNO,
            scope: this,
            fn: function(button) {
              if (button == "yes") {
                this.disablePackage.call(this, package);
              }
            },
            animEl: 'elId',
            icon: Ext.MessageBox.QUESTION
          });
        } else {
          Ext.Msg.show({
            title:'enable plugin?',
            msg: 'Would you like to enable "' + Ext.util.Format.htmlEncode(package) + '"?',
            buttons: Ext.Msg.YESNO,
            scope: this,
            fn: function(buttonId, text, opt) {
              if (buttonId == "yes") {
                this.enablePackage.call(this, package);
              }
            },
            animEl: 'elId',
            icon: Ext.MessageBox.QUESTION
          });
        }
      }
    }
  },
  enablePackage: function(package) {
    Ext.Ajax.request({
      url: 'set_signal?signal=change-plugin&signal_params=enable ' + package,
      waitMsg: getLL("nvidia.submit.waitmsg"),
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        this.packagesStore.reload();
      },
      failure: function() {
        alert('fatal error: disable plugin failed');
        this.packagesStore.reload();
      }
    });
  },
  disablePackage: function(package) {
    Ext.Ajax.request({
      url: 'set_signal?signal=change-plugin&signal_params=disable ' + package,
      waitMsg: getLL("nvidia.submit.waitmsg"),
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        this.packagesStore.reload();
      },
      failure: function() {
        alert('fatal error: disable plugin failed');
        this.packagesStore.reload();
      }
    });
  },
  stateRenderer: function(state) {
    switch (state) {
      case 2:
        return '<img src="/static/images/green.png" border="0">';
        break;
      case 0:
        return '<img src="/static/images/red.png" border="0">';
        break;
      case 1:
        return '<img src="/static/images/yellow.png" border="0">';
        break;
    }
  }
});

Ext.onReady(function() {
  YaVDRMenuManager
    .addGroupPanelSection({ section: "vdr" })
    .addGroupPanelTab({ layout: 'fit', section: "packages", items: function() {
    return new YaVDR.Packages()
  }});
});
