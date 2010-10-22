YaVDR.Remote = Ext.extend(YaVDR.BaseTabPanel, {
  initComponent: function() {
    
    this.items = [
      new YaVDR.Remote.Help({itemId: 'help'}),
      new YaVDR.Remote.Lirc({itemId: 'lirc'}),
      new YaVDR.Remote.InputLirc({itemId: 'input_lirc'}),
      new YaVDR.Remote.IrServer({itemId: 'ir_server'})
    ];
    
    YaVDR.Remote.superclass.initComponent.call(this);
  }
});

YaVDR.Remote.Help = Ext.extend(Ext.Panel, {
  title: 'Hilfe',
  bodyStyle: 'background-color: #DFE8F6; padding: 10px;',
  initComponent: function() {
    
    this.items = [
      {
        xtype: 'box',
        html: '<p>' + getLL("remote.help") + '<br/>&nbsp;</p>' +
                '<h2>Lirc</h2><p>' + getLL("lirc.help") + '<br/>&nbsp;</p>' +
                '<h2>InputLirc</h2><p>' + getLL("inputlirc.help") + '<br/>&nbsp;</p>' +
                '<h2>Irserver</h2><p>' + getLL("irserver.help") + '</p>'
      }
    ];
    
    YaVDR.Remote.Help.superclass.initComponent.call(this);
  }
});

YaVDR.Remote.Lirc = Ext.extend(Ext.FormPanel, {
  title: 'LIRC',
  labelWidth: 200,
  bodyStyle: 'background-color: #DFE8F6; padding: 10px;',
  initComponent: function() {
    this.driverStore = new Ext.data.ArrayStore({
      fields: [
        "id",
        "description",
        "driver",
        "lirc_driver",
        "hw_default",
        "lircd_conf"
      ],
      sortInfo: {
        field: 'description',
        direction: 'ASC'
      }
    });
    
    
    this.driver = new Ext.form.ComboBox({
      itemId: 'driver',
      tpl2: '<tpl for="."><div ext:qtip="' + 
        getLL("lirc.combobox.tooltip.driver") + 
        ': {driver}<br/'+'>' + 
        getLL("lirc.combobox.tooltip.lirc_driver") + 
        ': {lirc_driver}<br/'+
        '>HW-Default: {hw_default}<'+'br/'+
        '>Lircd-Conf: {lircd_conf}" class="x-combo-list-item">{description}</div></tpl>',

      hiddenName: 'receiver_id',
      valueField: 'id',
      width: 400,
      displayField:'description',
      typeAhead: true,
      forceSelection: true,
      mode: "local",
      store: this.driverStore,
      triggerAction: 'all',
      emptyText: getLL("lirc.combobox.emptytext"),
      fieldLabel: getLL("lirc.combobox.label"),
      selectOnFocus: true,
      disabled: true
    });
    
    this.serialPort = new Ext.form.RadioGroup({
        itemId: 'serial_port',
        name: 'serial_port',
        columns: 1,
        fieldLabel: getLL("lirc.serial_radiogroup.label"),
        items: [
            {boxLabel: getLL("lirc.serial_radiogroup.boxlabel_none"), name: 'serial_port', inputValue: ''},
            {boxLabel: '/dev/ttyS0', name: 'serial_port', inputValue: '/dev/ttyS0'},
            {boxLabel: '/dev/ttyS1', name: 'serial_port', inputValue: '/dev/ttyS1'}
        ],
        disabled: true
    });
    
    this.active = new Ext.form.Checkbox({
      name: 'active',
      fieldLabel: 'LIRC aktivieren',
      listeners: {
          scope: this,
          check: function(cb, checked) {
            if(checked) {
              this.driver.enable();
              this.serialPort.enable();
            } else {
              this.serialPort.disable();
              this.driver.disable();
            }
          }
        }
    });
    
    this.items = [
      {
        xtype: 'hidden',
        name: 'remotetype',
        value: 'lircd'
      },
      this.active,
      this.driver,
      this.serialPort
    ];
    
    this.tbar = [
      {
        scope: this,
        itemId: 'save',
        text: 'Speichern',
        icon: '/static/images/icons/save.png',
        handler: this.saveSettings
      }
    ];
    
    YaVDR.Remote.Lirc.superclass.initComponent.call(this);
    
    this.driver.on('enable', function(field) {
      field.setValue(this.lircData.current_receiver);
    }, this);
    this.driver.on('disable', function(field) {
      field.setValue('');
    }, this);
    this.serialPort.on('enable', function(field) {
      field.setValue(this.lircData.current_serial_port);
    }, this);
    this.serialPort.on('disable', function(field) {
      field.setValue('');
    }, this);
    
    this.on('render', this.loadData, this);
  },
  loadData: function () {
    Ext.Ajax.request({
      url: 'get_lirchwdb',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        this.lircData = Ext.decode(xhr.responseText);
        this.driverStore.loadData(this.lircData.receiverlist);
        this.active.setValue(this.lircData.current_receiver > 0);
      }
    });
  },
  saveSettings: function() {
    this.getForm().submit({
      url: 'set_lirchw',
      waitMsg: getLL("lirc.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("lirc.submit.success"));
      },
      failure:function(form, action) {
        console.log(action);
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("lirc.submit.failure"));
      }
    })
  }
});

YaVDR.Remote.InputLirc = Ext.extend(Ext.FormPanel, {
  title: 'Inputlirc',
  bodyStyle: 'background-color: #DFE8F6; padding: 10px;',
  initComponent: function() {
    YaVDR.Remote.InputLirc.superclass.initComponent.call(this);
  }
});

YaVDR.Remote.IrServer = Ext.extend(Ext.FormPanel, {
  title: 'IRServer',
  bodyStyle: 'background-color: #DFE8F6;',
  initComponent: function() {
    YaVDR.Remote.IrServer.superclass.initComponent.call(this);
  }
});



Ext.form.RemoteFormPanel = Ext.extend(Ext.form.FormPanel, {
    frame: true,
    plain: false,
    border: true,
    bodyStyle:'padding:15px 5px 0',
    labelWidth: 130,
    defaults: {width: 400},
    defaultType: 'textfield',
    buttonAlign: 'left',

    initComponent: function() {
        Ext.form.RemoteFormPanel.superclass.initComponent.call(this);
    },
    
    enable: function() {
        this.items.each(function(e) {
            e.enable();
            if (e.name == 'remotetype') {
                e.setValue(true);
            }
        });
        Ext.each(this.buttons, function(e) {
            e.enable();
        });
    },
    
    disable: function() {
        this.items.each(function(e) {
            if (e.name != 'remotetype') {
                e.disable();
            } else {
                e.setValue(false);
            }
        });
        Ext.each(this.buttons, function(e) {
            e.disable();
        });
    }
});
Ext.reg('remoteform', Ext.form.RemoteFormPanel);

Ext.RemoteTabPanel = Ext.extend(Ext.TabPanel, {
    initComponent: function() {
        Ext.RemoteTabPanel.superclass.initComponent.call(this);
    },
    
    enableRemoteTab: function(radio) {
        var form = radio.findParentByType('remoteform');
        if (form != null) {
            var tab = form.ownerCt;
            this.items.each(function(entry) {
                if (entry.items != null) {
                    entry.items.each(function(e2) {
                        if (e2.getXType() == 'remoteform') {
                            if (entry == tab) {
                                e2.enable();
                            } else {
                                e2.disable();
                            }
                        }
                    });
                }
            });
        }
    }    
});
Ext.reg('remotetabpanel', Ext.RemoteTabPanel);

function getRemoteForm() {
    var panel = new Ext.RemoteTabPanel({
        activeTab: 0,
        plain: false,
        border: false,
        items: [{
            xtype: 'panel',
            title: 'Hilfe',
            frame: true,
            plain: true,
            border: true,
            bodyStyle:'padding:5px',
            html: '<p>' + getLL("remote.help") + '<br/>&nbsp;</p>' +
                '<h2>Lirc</h2><p>' + getLL("lirc.help") + '<br/>&nbsp;</p>' +
                '<h2>InputLirc</h2><p>' + getLL("inputlirc.help") + '<br/>&nbsp;</p>' +
                '<h2>Irserver</h2><p>' + getLL("irserver.help") + '</p>'
        },{
            title: 'LIRC',
            bodyCssClass: 'lirc',
            items: getLircForm()
        },{
            title: 'Inputlirc',
            layout: 'form',
            bodyCssClass: 'inputlirc',
            items: getInputlircForm()
        },{
            title: 'IRServer',
            layout: 'form',
            bodyCssClass: 'irserver',
            items: getIRServerForm()
        }]
    });
    return panel;
}

Ext.onReady(function() {
    YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "remote",
                layout: 'fit',
                items: function() {
                  return new YaVDR.Remote
                }
              //  items:   getRemoteForm
              
            });
                YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "remote",
                items:   getRemoteForm
              
            });
});