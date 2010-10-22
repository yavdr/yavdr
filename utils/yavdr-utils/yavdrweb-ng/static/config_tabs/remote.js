YaVDR.Remote = Ext.extend(YaVDR.BaseTabPanel, {
  data: {},
  deferredRender: false,
  initComponent: function() {
    this.initHelp();
    this.initLirc();
    this.initInputLirc();
    this.initIrServer();
    
    this.items = [
      this.helpPanel,
      this.lircPanel,
      this.inputLircPanel,
      this.irServerPabel
    ];
    
    YaVDR.Remote.superclass.initComponent.call(this);
    
    this.lircDriver.on('enable', function(field) {
      field.setValue(this.data.currentLircReceiver);
    }, this);
    this.lircDriver.on('disable', function(field) {
      field.setValue('');
    }, this);
    this.lircSerialPort.on('enable', function(field) {
      field.setValue(this.data.currentLircSerialPort);
    }, this);
    this.lircSerialPort.on('disable', function(field) {
      field.setValue('');
    }, this);
    
    this.on('render', this.loadData, this);
    this.inputLircPanel.on('show', this.reloadInputLircReceiver, this, { signle: true })
  },
  loadData: function () {
    Ext.Ajax.request({
      url: 'get_lirchwdb',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var data = Ext.decode(xhr.responseText);
        this.data.lircReceiverList = data.receiverlist;
        this.data.currentRemoted = data.current_remoted;
        this.data.currentLircReceiver = data.current_receiver;
        this.data.currentLircSerialPort = data.current_serial_port;

        this.lircReceiverStore.loadData(this.data.lircReceiverList);
        this.lircActive.setValue(this.data.currentRemoted == 'lircd');
        this.inputLircActive.setValue(this.data.currentRemoted == 'inputlirc');
        this.irServerActive.setValue(this.data.currentRemoted == 'irserver');
      }
    });
  },
  reloadInputLircReceiver: function() {
    Ext.Ajax.request({
      url: 'get_inputlirc',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var data = Ext.decode(xhr.responseText);
        this.data.currentInputLircReceiver = data.current_receiver;
        this.data.inputLircReceiverList = data.receiverlist;
        this.inputLircReceiverStore.loadData(this.data.inputLircReceiverList);
        if(this.inputLircActive.getValue()) {
          this.inputLircReceiver.setValue(this.data.currentInputLircReceiver);
        }
      }
    })
  },
  initInputLirc: function() {
    this.inputLircSave = new Ext.Button({
      scope: this,
      disabled: true,
      itemId: 'save',
      text: 'Speichern',
      icon: '/static/images/icons/save.png',
      handler: this.saveInputLircSettings
    });
    
    this.inputLircReload = new Ext.Button({
      scope: this,    
      disabled: true,
      itemId: 'reload',
      text: 'Empfänger neuladen',
      icon: '/static/images/icons/refresh.png',
      handler: this.reloadInputLircReceiver
    });
    
    this.inputLircActive = new Ext.form.Radio({
      name: 'active',
      name: 'remotetype',
      fieldLabel: 'Inputlirc aktivieren',
      inputValue: 'inputlirc',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if(checked) {
            this.lircActive.setValue(false);
            this.irServerActive.setValue(false);
            this.inputLircSave.enable();
            this.inputLircReload.enable();
            this.inputLircReceiver.enable();
          } else {
            this.inputLircSave.disable();
            this.inputLircReload.disable();
            this.inputLircReceiver.disable();
          }
        }
      }
    });
    
    this.inputLircReceiverStore= new Ext.data.ArrayStore({
      fields: [
        "path",
        "description"
      ],
      sortInfo: {
        field: 'description',
        direction: 'ASC'
      }
    });
    
    this.inputLircReceiver = new Ext.form.ComboBox({
      width: 400,
      store: this.inputLircReceiverStore,
      hiddenName: 'receiver_path',
      valueField: 'path',
      displayField:'description',
      typeAhead: true,
      forceSelection: true,
      mode: "local",
      triggerAction: 'all',
      emptyText: getLL("inputlirc.combobox.emptytext"),
      fieldLabel: getLL("inputlirc.combobox.label"),
      selectOnFocus: true,
      disabled: true
    });

    this.inputLircPanel = new Ext.FormPanel({
      itemId: 'inputlirc',
      title: 'Inputlirc',
      autoScroll: true,
      labelWidth: 200,
      bodyStyle: 'background-color: #DFE8F6; padding: 10px;',
      tbar: [
        this.inputLircSave,
        this.inputLircReload
      ],
      items: [
        this.inputLircActive,
        this.inputLircReceiver
      ]
    });
  },
  initIrServer: function() {
    this.irServerSave = new Ext.Button({
      scope: this,
      disabled: true,
      itemId: 'save',
      text: 'Speichern',
      icon: '/static/images/icons/save.png',
      handler: this.saveIrServerSettings
    });
    
    this.irServerActive = new Ext.form.Radio({
      name: 'active',
      name: 'remotetype',
      fieldLabel: 'IRServer aktivieren',
      inputValue: 'irserver',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if(checked) {
            this.lircActive.setValue(false);
            this.inputLircActive.setValue(false);
            this.irServerSave.enable();
          } else {
            this.irServerSave.disable();
          }
        }
      }
    });

    this.irServerPabel = new Ext.FormPanel({
      itemId: 'irserver',
      title: 'IRServer',
      autoScroll: true,
      labelWidth: 200,
      bodyStyle: 'background-color: #DFE8F6; padding: 10px;',
      tbar: [this.irServerSave],
      items: [this.irServerActive]
    });
  },
  initHelp: function() {
    this.helpPanel = new Ext.Panel({
      autoScroll: true,
      itemId: 'help',
      title: 'Hilfe',
      bodyStyle: 'background-color: #DFE8F6; padding: 10px;',
      html: '<p>' + getLL("remote.help") + '<br/>&nbsp;</p>' +
        '<h2>Lirc</h2><p>' + getLL("lirc.help") + '<br/>&nbsp;</p>' +
        '<h2>InputLirc</h2><p>' + getLL("inputlirc.help") + '<br/>&nbsp;</p>' +
        '<h2>Irserver</h2><p>' + getLL("irserver.help") + '</p>'
    });
  },
  initLirc: function() {
    this.lircReceiverStore = new Ext.data.ArrayStore({
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
    
    this.lircDriver = new Ext.form.ComboBox({
      itemId: 'driver',
      tpl: '<tpl for="."><div ext:qtip="' + 
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
      store: this.lircReceiverStore,
      triggerAction: 'all',
      emptyText: getLL("lirc.combobox.emptytext"),
      fieldLabel: getLL("lirc.combobox.label"),
      selectOnFocus: true,
      disabled: true
    });
    
        
    this.lircSerialPort = new Ext.form.RadioGroup({
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
    
    this.lircSave = new Ext.Button({
      scope: this,
      disabled: true,
      itemId: 'save',
      text: 'Speichern',
      icon: '/static/images/icons/save.png',
      handler: this.saveLircSettings
    })
    
    this.lircActive = new Ext.form.Radio({
      name: 'active',
      name: 'remotetype',
      inputValue: 'lircd',
      fieldLabel: 'LIRC aktivieren',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if(checked) {
            this.inputLircActive.setValue(false);
            this.irServerActive.setValue(false);
            this.lircSave.enable();
            this.lircSerialPort.enable();
            this.lircDriver.enable();
          } else {
            this.lircSave.disable();
            this.lircSerialPort.disable();
            this.lircDriver.disable();
          }
        }
      }
    });
    
    this.lircPanel = new Ext.FormPanel({
      autoScroll: true,
      title: 'LIRC',
      labelWidth: 200,
      bodyStyle: 'background-color: #DFE8F6; padding: 10px;',
      tbar: [this.lircSave],
      items: [
        this.lircActive,
        this.lircDriver,
        this.lircSerialPort
      ]
    });
  },
  
  saveInputLircSettings: function() {
    this.inputLircPanel.getForm().submit({
      url: 'set_inputlirc',
      waitMsg: getLL("inputlirc.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("inputlirc.submit.success"));
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("inputlirc.submit.failure"));
      }
    })
  },
  
  saveIrServerSettings: function() {
    this.irServerPabel.getForm().submit({
      url: 'set_irserver',
      waitMsg: getLL("irserver.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("irserver.submit.success"));
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("irserver.submit.failure"));
      }
    })
  },
  
  saveLircSettings: function() {
    this.lircPanel.getForm().submit({
      url: 'set_lirchw',
      waitMsg: getLL("lirc.submit.waitmsg"),
      waitTitle: getLL("standardform.messagebox_caption.wait"),
      scope: this,
      success: function (form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.message"), getLL("lirc.submit.success"));
      },
      failure:function(form, action) {
        Ext.MessageBox.alert( getLL("standardform.messagebox_caption.error"), getLL("lirc.submit.failure"));
      }
    })
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
             /*   YaVDRMenuManager
        .addGroupPanelSection({section: "system"})
            .addGroupPanelTab({
                section: "remote",
                items:   getRemoteForm
              
            });*/
});