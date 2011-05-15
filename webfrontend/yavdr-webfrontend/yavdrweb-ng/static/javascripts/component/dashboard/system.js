YaVDR.Component.Dashboard.System = Ext.extend(YaVDR.Component.Dashboard.Item, {
  
  title: _('System'),
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
        fieldLabel: _('Shutdown'),
        name: 'shutdown',
        value: ''
      },{
        xtype: 'displayfield',
        fieldLabel: _('CPU load'),
        name: 'load',
        value: ''
      },{
        xtype: 'displayfield',
        fieldLabel: _('RAM'),
        name: 'ram',
        value: ''
      },{
        xtype: 'displayfield',
        fieldLabel: _('Sound'),
        name: 'output',
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
      url: '/admin/dashboard_system',
      success: function(form, action) {
        form.setValues({
          ram: sprintf(_('%d MB (%d MB free)'), action.result.data.memory.available / 1024 / 1024, action.result.data.memory.free / 1024 / 1024),
          load: sprintf(_('1 min: %0.2f, 5 min: %0.2f, 15 min: %0.2f'), action.result.data.loads[0], action.result.data.loads[1], action.result.data.loads[2] ),
          output: _(action.result.data.sound)
        });
        this.getEl().unmask();
      },
      failure: function(form, action) {
        this.getEl().unmask();
      },
      scope: this
    })
  }
//html: '<b>Shutdown</b>: S3 (Disabled USB-Wakeup)<br> <b>CPU</b>: 10% - <b>RAM</b>: 1024MB (169 MG frei)<br><b>Soundausgabe</b>: HDMI + Analog<br>Achtung Demo Inhalt'
});

