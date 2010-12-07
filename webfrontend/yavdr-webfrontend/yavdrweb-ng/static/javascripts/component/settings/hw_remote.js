YaVDR.Component.Settings.HwRemote = Ext.extend(YaVDR.Component, {
  data: {},
  itemId: 'settings-hw-remote',
  title: _('Settings'),
  description: '<p>' + _('In Order to configure your remote control, choose LIRC or one of the both LIRC compatible daemons (Inputlirc or IRServer). If you press "Save" , VDR will be restarted to activate the new settings.<br>If VDR has no key mapping yet it will directly start a learning phase at your output device "On Screen Display". The learning phase ends after a couple of seconds automatically, if no button has been pressed. You can restart the "Learning Phase" by pressing "Save" again..<br>&nbsp;</p><h2>Lirc</h2><p>Most common choice. Please choose the correct driver.<br>In case of serial port conntected devices,please also choose the correct port.<br>&nbsp;</p><h2>InputLirc</h2><p>This is comfortable choice for most modern USB remote controls, as well as for most of the Remote Controls delivered and connected to DVB cards. For the latter case please make sure, the remote control receiver is supported by the driver. Please choose the device from the list.<br>&nbsp;</p><h2>Irserver</h2><p>For remote controls supported by IRserver. Supported hardware will be detected. You just need to activate the choice and save it.') + '</p>',
  initComponent: function() {

    this.lircForm = new YaVDR.Component.Settings.HwRemote.LIRC({
      base: this
    });

    this.inputlircForm = new YaVDR.Component.Settings.HwRemote.InputLIRC({
      base: this
    });

    this.irserverForm = new YaVDR.Component.Settings.HwRemote.IrServer({
      base: this
    });

    this.items = [
      new YaVDR.Component.Item({
        title: _('LIRC'),
        style: 'margin-bottom: 5px',
        items: this.lircForm
      }),
      new YaVDR.Component.Item({
        title: _('Inputlirc'),
        style: 'margin-bottom: 5px',
        items: this.inputlircForm
      }),
      new YaVDR.Component.Item({
        title: _('IRServer'),
        items: this.irserverForm
      })
    ];
    YaVDR.Component.Settings.HwRemote.superclass.initComponent.call(this);

    this.lircForm.driver.on('enable', function(field) {
      field.setValue(this.data.currentLircReceiver);
    }, this);
    this.lircForm.driver.on('disable', function(field) {
      field.setValue('');
    }, this);
    this.lircForm.serialPort.on('enable', function(field) {
      field.setValue(this.data.currentLircSerialPort);
    }, this);
    this.lircForm.serialPort.on('disable', function(field) {
      field.setValue('');
    }, this);

    this.on('render', this.doLoad, this);
  },

  // Global load
  doLoad: function() {
    Ext.Ajax.request({
      url: '/admin/get_lirchwdb',
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var data = Ext.decode(xhr.responseText);
        this.data.lircReceiverList = data.receiverlist;
        this.data.currentRemoted = data.current_remoted;
        this.data.currentLircReceiver = data.current_receiver;
        this.data.currentLircSerialPort = data.current_serial_port;

        this.lircForm.receiverStore.loadData(this.data.lircReceiverList);
        this.lircForm.active.setValue(this.data.currentRemoted == 'lircd');
        this.inputlircForm.active.setValue(this.data.currentRemoted == 'inputlirc');
        this.irserverForm.active.setValue(this.data.currentRemoted == 'irserver');
      }
    });
    this.inputlircForm.reloadReceiver();
  }
});
YaVDR.registerComponent(YaVDR.Component.Settings.HwRemote);

YaVDR.Component.Settings.HwRemote.LIRC = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.receiverStore = new Ext.data.ArrayStore({
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
      tpl: '<tpl for="."><div ext:qtip="' +
        _("Driver") +
        ': {driver}<br/' + '>' +
        _('LIRC driver') +
        ': {lirc_driver}<br/' +
        '>' + _('HW-Default') + ': {hw_default}<' + 'br/' +
        '>' + _('Lircd-Conf') + ': {lircd_conf}" class="x-combo-list-item">{description}</div></tpl>',

      hiddenName: 'receiver_id',
      valueField: 'id',
      anchor: '100%',
      displayField:'description',
      typeAhead: true,
      forceSelection: true,
      mode: "local",
      store: this.receiverStore,
      triggerAction: 'all',
      fieldLabel: _('Receiver'),
      selectOnFocus: true,
      disabled: true
    });


    this.serialPort = new Ext.form.RadioGroup({
      itemId: 'serial_port',
      name: 'serial_port',
      columns: 1,
      fieldLabel: _('Serial Port'),
      items: [
        {boxLabel: 'none', name: 'serial_port', inputValue: ''},
        {boxLabel: '/dev/ttyS0 (COM1)', name: 'serial_port', inputValue: '/dev/ttyS0'},
        {boxLabel: '/dev/ttyS1 (COM2)', name: 'serial_port', inputValue: '/dev/ttyS1'}
      ],
      disabled: true
    });

    this.active = new Ext.form.Radio({
      name: 'remotetype',
      inputValue: 'lircd',
      fieldLabel: _('Activate LIRC'),
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if (checked) {
            this.base.irserverForm.active.setValue(false);
            this.base.inputlircForm.active.setValue(false);
            this.getFooterToolbar().getComponent('save').enable();
            this.serialPort.enable();
            this.driver.enable();
          } else {
            this.getFooterToolbar().getComponent('save').disable();
            this.serialPort.disable();
            this.driver.disable();
          }
        }
      }
    });

    this.items = [
      this.active,
      this.driver,
      this.serialPort
    ];

    YaVDR.Component.Settings.HwRemote.LIRC.superclass.initComponent.call(this);
    this.getFooterToolbar().getComponent('save').disable();
    // own handler -> so disable auto load
    this.un('render', this.doLoad);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_lirchw'
    })
  },
  doLoad: function() {
    this.base.doLoad.call(this.base);
  }
});

YaVDR.Component.Settings.HwRemote.InputLIRC = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.active = new Ext.form.Radio({
      name: 'remotetype',
      fieldLabel: _('Activate Inputlirc'),
      inputValue: 'inputlirc',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if (checked) {
            this.base.irserverForm.active.setValue(false);
            this.base.lircForm.active.setValue(false);
            this.getFooterToolbar().getComponent('reload').enable();
            this.getFooterToolbar().getComponent('save').enable();
            this.receiver.enable();
          } else {
            this.getFooterToolbar().getComponent('reload').disable();
            this.getFooterToolbar().getComponent('save').disable();
            this.receiver.disable();
          }
        }
      }
    });

    this.receiverStore = new Ext.data.ArrayStore({
      fields: [
        "path",
        "description"
      ],
      sortInfo: {
        field: 'description',
        direction: 'ASC'
      }
    });

    this.receiver = new Ext.form.ComboBox({
      anchor: '100%',
      store: this.receiverStore,
      hiddenName: 'receiver_path',
      valueField: 'path',
      displayField:'description',
      typeAhead: true,
      forceSelection: true,
      mode: "local",
      triggerAction: 'all',
      fieldLabel: _('Receiver'),
      selectOnFocus: true,
      disabled: true
    });

    this.items = [
      this.active,
      this.receiver
    ];

    YaVDR.Component.Settings.HwRemote.InputLIRC.superclass.initComponent.call(this);
    this.getFooterToolbar().insert(1, {
      itemId: 'reload',
      icon: '/static/images/icons/refresh.png',
      text: 'Reload',
      scope: this,
      handler: this.reloadReceiver
    });

    this.getFooterToolbar().getComponent('save').disable();
    // own handler -> so disable auto load
    this.un('render', this.doLoad);
  },

  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_inputlirc'
    })
  },
  doLoad: function() {
    this.base.doLoad.call(this.base);
  },
  reloadReceiver: function() {
    Ext.Ajax.request({
      url: '/admin/get_inputlirc',
      timeout: 3000,
      method: 'GET',
      scope: this,
      success: function(xhr) {
        var data = Ext.decode(xhr.responseText);
        this.base.data.currentInputLircReceiver = data.current_receiver;
        this.base.data.inputLircReceiverList = data.receiverlist;
        this.receiverStore.loadData(this.base.data.inputLircReceiverList);
        this.receiver.setValue(this.base.data.currentInputLircReceiver);

      }
    })
  }
});

YaVDR.Component.Settings.HwRemote.IrServer = Ext.extend(YaVDR.Default.Form, {
  initComponent: function() {

    this.active = new Ext.form.Radio({
      name: 'remotetype',
      fieldLabel: _('Activate IRServer'),
      inputValue: 'irserver',
      listeners: {
        scope: this,
        check: function(cb, checked) {
          if (checked) {
            this.base.lircForm.active.setValue(false);
            this.base.inputlircForm.active.setValue(false);
            this.getFooterToolbar().getComponent('save').enable();
          } else {
            this.getFooterToolbar().getComponent('save').disable();
          }
        }
      }
    });

    this.items = [
      this.active
    ];

    YaVDR.Component.Settings.HwRemote.IrServer.superclass.initComponent.call(this);
    this.getFooterToolbar().getComponent('save').disable();
    // own handler -> so disable auto load
    this.un('render', this.doLoad);
  },
  doSave: function() {
    this.getForm().submit({
      url: '/admin/set_irserver'
    })
  },
  doLoad: function() {
    this.base.doLoad.call(this.base);
  }
});
