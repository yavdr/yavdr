YaVDR.Component.Settings.SystemPackages = Ext.extend(YaVDR.Component, {
  itemId: 'settings-system-packages',
  layout: 'border',
  initComponent: function() {
    this.initPackagesStore();
    this.initGridPanel();
    this.initDetailPanel();

    this.items = [
      new YaVDR.Component.Header({
        region: 'north',
        html: 'Settings'
      }),
      new YaVDR.Component.Item({
        region: 'center',
        style: '',
        layout: 'border',
        title: _('Package Installer'),
        tbar: [
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
          },
          {
              text: 'apt-get clean',
              icon: '/static/images/icons/dpkg_clean.png',
              tooltip: {
                text: _('apt-get clean clears out the local repository of retrieved package file'),
                title: 'apt-get clean'
              },
              scope: this,
              handler: this.aptClean
            }
        ],
        items: [this.gridPanel, this.detailPanel]
      })
    ];
    YaVDR.Component.Settings.SystemPackages.superclass.initComponent.call(this);

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
          text: _('Install'),
          icon: '/static/images/icons/dpkg_install.png',
          disabled: (record.data.installed != 0),
          handler: function() {
            this.installPackage(package);
          }
        },
        {
          scope: this,
          text: _('Remove'),
          icon: '/static/images/icons/dpkg_remove.png',
          disabled: (record.data.installed == 0),
          handler: function() {
            this.removePackage(package);
          }
        },
        {
          scope: this,
          text: _('Activate'),
          icon: '/static/images/icons/dpkg_enable.png',
          disabled: (record.data.Package.substr(0, 11) != "vdr-plugin-" || record.data.installed == 2 || record.data.installed == 0),
          handler: function() {
            this.enablePackage(package);
          }
        },
        {
          scope: this,
          text: _('Deactivate'),
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
  aptClean: function() {
	YaVDR.DPKG.clean(this);
  },
  initGridEvents: function() {
    // load store only first time
    this.on('render', this.reloadPackages, this, { single: true });
    this.gridPanel.on('rowcontextmenu', this.onGridRowContextMenu, this);
    this.gridPanel.getSelectionModel().on('rowselect', this.updateDetail, this);
  },
  detailTemplate: function() {
    return new Ext.Template([
      _('Package') +': {Package}<br/>',
      _('Maintainer') +': {Maintainer}<br/>',
      _('Description') +': {Description}<br/>'
    ]);
  },
  updateDetail: function(sm, index, row) {
    this.detailTemplate().overwrite(this.detailPanel.body, row.data);
  },
  reloadPackages: function() {
    this.packagesStore.reload();
  },
  initPackagesStore: function() {
    this.packagesStore = new Ext.data.JsonStore({
      url: '/admin/get_packages',
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
      style: "border: 1px solid #D0D0D0",
      cls: 'frame-panel-border',
      autoScroll: true,
      bodyStyle: {
        background: '#ffffff',
        padding: '7px'
      },
      height: 74,
      itemId: 'package-detail',
      html: _('Please select a package to see additional details.')
    });
  },
  initGridPanel: function() {
    this.gridPanel = new Ext.grid.GridPanel({
      store: this.packagesStore,
      region: 'center',
      loadMask: true,
      style: "border: 1px solid #D0D0D0",
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
            header: _('Package'),
            width: 180,
            dataIndex: 'Package'
          },
          {
            header: _('Version'),
            width: 180,
            dataIndex: 'Version'
          },
          {
            header: _('Maintainer'),
            width: 180,
            dataIndex: 'Maintainer'
          },
          {
            header: _('Description'),
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
YaVDR.registerComponent(YaVDR.Component.Settings.SystemPackages);
