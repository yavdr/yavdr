// Installer Component
YaVDR.DPKG = Ext.extend(Ext.Window, {
  callback: null,
  store: null,
  command: 'update',
  title: 'yaVDR Paket Installer',
  width: 600,
  height: 450,
  resizable: true,
  maximizable: true,
  closable: false,
  modal: true,
  layout: 'fit',
  id: 'dpkg',
  initComponent: function() {

    if (this.command == 'install' || this.command == 'remove') {
      var url = 'dpkg?command=' + this.command + '&package=' + this.package + '&ts=' + ((new Date()).getTime());
    } else {
      var url = 'dpkg?command=' + this.command + '&ts=' + ((new Date()).getTime());
    }
        
    this.iframe = new Ext.ux.ManagedIFrame.Panel({
      border: false,
      defaultSrc : url
    });

    this.items = [this.iframe];

    this.closeButton = new Ext.Button({
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
    });
    
    this.buttons = [this.closeButton];

    YaVDR.DPKG.superclass.initComponent.call(this);
    
    this.iframe.on('domready', this.activateCloseButton, this, { single: true });
  },
  activateCloseButton: function() {
    this.closeButton.enable();
  }
});

// Public API
Ext.apply(YaVDR.DPKG, {
  update: function(callback, scope) {
    (new YaVDR.DPKG({
      scope: scope,
      command: 'update',
      callback: callback
    })).show();
  },
  autoremove: function(callback, scope) {
    (new YaVDR.DPKG({
      scope: scope,
      command: 'autoremove',
      callback: callback
    })).show();
  },
  install: function(package, callback, scope) {
    Ext.Msg.show({
      title:'Install package?',
      msg: 'Would you like to install package "' + Ext.util.Format.htmlEncode(package) + '"?',
      buttons: Ext.Msg.YESNO,
      animEl: 'elId',
      scope: this,
      icon: Ext.MessageBox.QUESTION,
      fn: function(button) {
        if (button == 'yes') {
          (new YaVDR.DPKG({
            scope: scope,
            package: package,
            command: 'install',
            callback: callback
          })).show();
        }
      }
    });
  },
  remove: function(package, callback, scope) {
    Ext.Msg.show({
      title:'Install package?',
      msg: 'Would you like to remove package "' + Ext.util.Format.htmlEncode(package) + '"?',
      buttons: Ext.Msg.YESNO,
      animEl: 'elId',
      scope: this,
      icon: Ext.MessageBox.QUESTION,
      fn: function(button) {
        if (button == 'yes') {
          (new YaVDR.DPKG({
            scope: scope,
            package: package,
            command: 'remove',
            callback: callback
          })).show();
        }
      }
    });
  },
  enable: function(package, callback, scope) {
    Ext.Msg.show({
      title:'enable plugin?',
      msg: 'Would you like to enable "' + Ext.util.Format.htmlEncode(package) + '"?',
      buttons: Ext.Msg.YESNO,
      fn: function(buttonId, text, opt) {
        if (buttonId == "yes") {
          Ext.Ajax.request({
            url: 'set_signal?signal=change-plugin&signal_params=enable ' + package,
            waitMsg: getLL("nvidia.submit.waitmsg"),
            timeout: 3000,
            method: 'GET',
            success: function(xhr) {
              callback.call(scope, true);
            },
            failure: function() {
              alert('fatal error: disable plugin failed');
              callback.call(scope, false);
            }
          });
        }
      },
      animEl: 'elId',
      icon: Ext.MessageBox.QUESTION
    });
  },
  disable: function(package, callback, scope) {
    Ext.Msg.show({
      title:'disable plugin?',
      msg: 'Would you like to disable "' + Ext.util.Format.htmlEncode(package) + '"?',
      buttons: Ext.Msg.YESNO,
      fn: function(button) {
        if (button == "yes") {
          Ext.Ajax.request({
            url: 'set_signal?signal=change-plugin&signal_params=disable ' + package,
            waitMsg: getLL("nvidia.submit.waitmsg"),
            timeout: 3000,
            method: 'GET',
            success: function(xhr) {
              callback.call(scope, true);
            },
            failure: function() {
              alert('fatal error: disable plugin failed');
              callback.call(scope, false);
            }
          });
        }
      },
      animEl: 'elId',
      icon: Ext.MessageBox.QUESTION
    });
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
    this.tbar = [
      {
        text: 'apt-get update',
        icon: '/static/images/icons/dpkg_update.png',
        scope: this,
        handler: this.aptUpdate
      },
      {
        text: 'apt-get autoremove',
        icon: '/static/images/icons/dpkg_autoremove.png',
        scope: this,
        handler: this.aptAutoRemove
      }
    ]

    YaVDR.Packages.superclass.initComponent.call(this);

    // init the events after initComponent
    this.initGridEvents();
  },
  onGridRowContextMenu: function(grid, rowIndex, e) {
    e.stopEvent();
    
    var record = this.gridPanel.store.getAt(rowIndex); 
    var package = record.data.Package;
    
    var menu = new Ext.menu.Menu({
      items: [
        {
          scope: this,
          text: 'Installieren',
          icon: '/static/images/icons/dpkg_remove.png',
          disabled: (record.data.installed != 0),
          handler: function() {
            this.installPackage(package);
          }
        },
        {
          scope: this,
          text: 'Deinstallieren',
          icon: '/static/images/icons/dpkg_install.png',
          disabled: (record.data.installed == 0),
          handler: function() {
            this.removePackage(package);
          }
        },
        {
          scope: this,
          text: 'Aktivieren',
          icon: '/static/images/icons/dpkg_enable.png',
          disabled: (record.data.Package.substr(0, 11) != "vdr-plugin-" || record.data.installed == 2 || record.data.installed == 0),
          handler: function() {
            this.enablePackage(package);
          }
        },
        {
          scope: this,
          text: 'Deaktivieren',
          icon: '/static/images/icons/dpkg_disable.png',
          disabled: (record.data.Package.substr(0, 11) != "vdr-plugin-" || record.data.installed != 2),
          handler: function() {
            this.disablePackage(package);
          }
        }
      ]
    });
    menu.showAt(e.getXY());
  },
  aptUpdate: function() {
    YaVDR.DPKG.update(this.reloadPackages, this);
  },
  aptAutoRemove: function() {
    YaVDR.DPKG.autoremove(this.reloadPackages, this);
  },
  initGridEvents: function() {
    // load store only first time
    this.on('render', this.reloadPackages, this, { single: true });
    // change status on dblClick
    this.gridPanel.on('celldblclick', this.changeStatusEvent, this);
    this.gridPanel.on('rowcontextmenu', this.onGridRowContextMenu, this);
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
      height: 90,
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
      loadMask: true,
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
  changeStatusEvent: function(grid, row, col, event) {
    // correct column?
    if ('installed' == grid.getColumnModel().getDataIndex(col)) {
      var record = grid.getStore().getAt(row);
      var package = record.data.Package;
      if (record.data.installed == 0) {
        this.installPackage(package);
      } else if (record.data.Package.substr(0, 11) == "vdr-plugin-") {
        if (record.data.installed == 2) {
          this.disablePackage(package);
        } else {
          this.enablePackage(package);
        }
      }
    }
  },
  removePackage: function(package) {
    YaVDR.DPKG.remove(package, function() {
      this.packagesStore.reload();
    }, this);
  },
  installPackage: function(package) {
    YaVDR.DPKG.install(package, function() {
      this.packagesStore.reload();
    }, this);
  },
  enablePackage: function(package) {
    YaVDR.DPKG.enable(package, function() {
      this.packagesStore.reload();
    }, this);
  },
  disablePackage: function(package) {
    YaVDR.DPKG.disable(package, function() {
      this.packagesStore.reload();
    }, this);
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
