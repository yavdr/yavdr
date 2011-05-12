
YaVDR.Component.Dashboard.Vdr = Ext.extend(YaVDR.Component.Dashboard.Item, {
  
  title: _('VDR'),
  style: 'margin: 0 5px 0 0 ',
  initComponent: function() {
    this.panel = new Ext.form.FormPanel({
      //bodyCssClass: 'frame-border',
      loadMask: true,
      viewConfig: {
          forceFit: true
      },
      items: [{
        xtype: 'displayfield',
        fieldLabel: _('VDR backend'),
        name: 'backend',
        value: ''
      },{
        xtype: 'displayfield',
        fieldLabel: _('Disk space'),
        name: 'diskspace',
        value: ''
      },{
        xtype: 'displayfield',
        fieldLabel: _('Frontend'),
        name: 'frontend',
        value: ''
      },{
        xtype: 'displayfield',
        fieldLabel: _('Resolution'),
        name: 'resolution',
        diskspace: ''
      }]
    });
    this.items = [this.panel];
    
    YaVDR.Component.Dashboard.Vdr.superclass.initComponent.call(this);
    
    this.panel.on('afterrender', function(form) {
      form.ownerCt.reload();
    }, this);
  },
  reload: function() {
    this.getEl().mask('loading');
    this.panel.load({
      url: '/admin/dashboard_vdr',
      success: function(form, action) {
        form.setValues({
          backend: (action.result.data.pid > 0?_('running'):_('stopped')),
          resolution: (action.result.data.resolution != ""?action.result.data.resolution:_('unknown'))
        });
        this.getEl().unmask();
      },
      failure: function(form, action) {
        this.getEl().unmask();
      },
      scope: this
    })
  }
//html: '<b>Status</b>: VDR gestartet<br><b>Speicherplatz</b>: 45G<br><b>Frontend</b>: Xine<br><b>Auflösung</b>: 1920x1080<br>Achtung Demo Inhalt'
});